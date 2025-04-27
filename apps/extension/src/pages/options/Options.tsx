import { Button } from "@repo/ui/button"
import { ThemeToggle } from "@repo/ui/theme-toggle"
import { useEffect, useState } from "react"
import { getUserSettings, updateUserSettings, type UserSettings } from "../../utils/storage"
import { ThemeProvider } from "@repo/ui/theme-provider"
import { Card } from "@repo/ui/card"
import { Spinner, SpinnerSettingsManager, SpinnerProvider, useSpinner } from "@repo/spinner"
import type { SpinnerSegment } from "@repo/spinner"
import { ExtensionSpinnerClient } from "../../utils/extension-spinner-client"

/**
 * Props for the login panel component
 */
interface LoginPanelProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  isLoggingIn: boolean;
  loginError: string;
}

/**
 * Login panel component that displays login form or user info
 */
const LoginPanel: React.FC<LoginPanelProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  isLoggingIn,
  loginError,
}) => {
  const { auth, client } = useSpinner();
  
  const handleLogout = async () => {
    if (client) {
      await client.logout();
    }
  };
  
  if (auth?.isAuthenticated) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-green-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Logged in as {auth.email}
          </p>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <p className="mb-4 text-muted-foreground">
        Log in to your account to access and manage your spinners.
      </p>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border bg-background"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border bg-background"
            placeholder="Enter your password"
            required
          />
        </div>

        {loginError && <div className="text-red-500 text-sm">{loginError}</div>}

        <Button type="submit" disabled={isLoggingIn} className="w-full">
          {isLoggingIn ? "Logging in..." : "Log In"}
        </Button>
      </form>
    </div>
  );
};

// Sample spinner data for preview
const PREVIEW_SEGMENTS: SpinnerSegment[] = [
  { id: "1", label: "Sample 1", value: "001" },
  { id: "2", label: "Sample 2", value: "002" },
  { id: "3", label: "Sample 3", value: "003" },
  { id: "4", label: "Sample 4", value: "004" },
]

// Create a singleton instance of the spinner client
const spinnerClient = new ExtensionSpinnerClient();

const Options: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings()
        setSettings(userSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)

    try {
      const authResult = await spinnerClient.authenticate(email, password)

      if (!authResult.isAuthenticated) {
        setLoginError("Invalid email or password. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An error occurred during login. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle form submissions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setIsSaving(true)
    setSaveMessage("")

    try {
      await updateUserSettings(settings)
      setSaveMessage("Settings saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
      setSaveMessage("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof UserSettings,
    field: string
  ) => {
    if (!settings) return

    const value =
      e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value

    setSettings({
      ...settings,
      [section]: {
        ...((settings[section] as object) || {}),
        [field]: value,
      },
    })
  }

  // Handle directus connection fields
  const handleDirectusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return

    setSettings({
      ...settings,
      [e.target.id]: e.target.value,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-red-500">Failed to load settings</div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="bmt-theme">
      <SpinnerProvider client={spinnerClient}>
        <div className="min-h-screen bg-background p-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Winner Spinner Settings</h1>
            <ThemeToggle />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="md:col-span-2 space-y-6">
              {/* Authentication Section */}
              <section className="bg-card rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">User Account</h2>
                <LoginPanel 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                  isLoggingIn={isLoggingIn}
                  loginError={loginError}
                />
              </section>

              {/* Spinner Settings Manager */}
              <section className="bg-card rounded-lg p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">Your Spinners</h2>
                <SpinnerSettingsManager />
              </section>

              {/* Extension Settings */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-card rounded-lg p-6 shadow">
                  <h2 className="text-xl font-semibold mb-4">Extension Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="directusUrl" className="block mb-2 text-sm font-medium">
                        Directus URL
                      </label>
                      <input
                        type="url"
                        id="directusUrl"
                        value={settings.directusUrl}
                        onChange={handleDirectusChange}
                        className="w-full p-2 rounded border bg-background"
                      />
                    </div>

                    <div>
                      <label htmlFor="directusToken" className="block mb-2 text-sm font-medium">
                        Directus Admin Token (optional)
                      </label>
                      <input
                        type="password"
                        id="directusToken"
                        value={settings.directusToken}
                        onChange={handleDirectusChange}
                        className="w-full p-2 rounded border bg-background"
                      />
                    </div>

                    <div>
                      <label htmlFor="spinDuration" className="block mb-2 text-sm font-medium">
                        Default Spin Duration (seconds)
                      </label>
                      <input
                        type="number"
                        id="spinDuration"
                        min="1"
                        max="30"
                        value={settings.spinner.spinDuration}
                        onChange={(e) => handleInputChange(e, "spinner", "spinDuration")}
                        className="w-full p-2 rounded border bg-background"
                      />
                    </div>

                    <div>
                      <label htmlFor="primaryColor" className="block mb-2 text-sm font-medium">
                        Default Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={settings.spinner.primaryColor}
                          onChange={(e) => handleInputChange(e, "spinner", "primaryColor")}
                          className="w-12 h-10 rounded border"
                        />
                        <input
                          type="text"
                          value={settings.spinner.primaryColor}
                          onChange={(e) => handleInputChange(e, "spinner", "primaryColor")}
                          className="w-32 p-2 rounded border bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="secondaryColor" className="block mb-2 text-sm font-medium">
                        Default Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="secondaryColor"
                          value={settings.spinner.secondaryColor}
                          onChange={(e) => handleInputChange(e, "spinner", "secondaryColor")}
                          className="w-12 h-10 rounded border"
                        />
                        <input
                          type="text"
                          value={settings.spinner.secondaryColor}
                          onChange={(e) => handleInputChange(e, "spinner", "secondaryColor")}
                          className="w-32 p-2 rounded border bg-background"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showConfetti"
                        checked={settings.spinner.showConfetti}
                        onChange={(e) => handleInputChange(e, "spinner", "showConfetti")}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="showConfetti" className="text-sm font-medium">
                        Show confetti effect when winner is revealed
                      </label>
                    </div>

                    <Button type="submit" disabled={isSaving} className="w-full mt-4">
                      {isSaving ? "Saving..." : "Save Extension Settings"}
                    </Button>

                    {saveMessage && (
                      <p
                        className={`mt-2 text-sm ${
                          saveMessage.includes("Failed") ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {saveMessage}
                      </p>
                    )}
                  </div>
                </section>
              </form>
            </div>

            <div className="space-y-6">
              <section className="bg-card rounded-lg p-6 shadow sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                <div className="mb-4">
                  <Spinner
                    segments={PREVIEW_SEGMENTS}
                    primaryColor={settings.spinner.primaryColor}
                    secondaryColor={settings.spinner.secondaryColor}
                    duration={settings.spinner.spinDuration}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>Better Made Tech Extension v1.0.0</p>
            <p>© {new Date().getFullYear()} Better Made Tech</p>
          </div>
        </div>
      </SpinnerProvider>
    </ThemeProvider>
  )
}

export default Options
