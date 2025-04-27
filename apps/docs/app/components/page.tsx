import { Button } from "@repo/ui/button";
import { Card, CardTitle, CardContent } from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import { Spinner } from "@repo/spinner";
import type { SpinnerSegment } from "@repo/spinner";
import { ThemeToggle } from "@repo/ui/theme-toggle";

// Sample data for components
const SAMPLE_SEGMENTS: SpinnerSegment[] = [
  { id: "1", label: "Option 1", value: "001" },
  { id: "2", label: "Option 2", value: "002" },
  { id: "3", label: "Option 3", value: "003" },
  { id: "4", label: "Option 4", value: "004" },
];

/**
 * Components documentation page showing all available UI components
 * with usage examples and code snippets.
 */
export default function ComponentsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Components</h1>
      <p className="text-lg mb-12">
        Better Made Tech provides a set of reusable UI components that can be used
        across different applications. Below you&apos;ll find documentation and examples
        for each component.
      </p>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="buttons">Buttons</h2>
        <p className="mb-6">
          Buttons are used to trigger actions or events. They come in different styles and sizes.
        </p>

        <Card className="mb-8 p-6">
          <CardTitle>Button Variants</CardTitle>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="accent">Accent</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 p-6">
          <CardTitle>Button Sizes</CardTitle>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardTitle>Usage Example</CardTitle>
          <CardContent className="pt-4">
            <Code variant="block">{`import { Button } from "@repo/ui/button";

export function MyComponent() {
  return (
    <div>
      <Button variant="default" size="md" onClick={() => console.log("Clicked!")}>
        Click Me
      </Button>
      
      <Button variant="outline" disabled>
        Disabled Button
      </Button>
    </div>
  );
}`}</Code>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="cards">Cards</h2>
        <p className="mb-6">
          Cards are used to group related content and actions. They provide a flexible
          container for displaying information.
        </p>

        <Card className="mb-8 p-6">
          <CardTitle>Standard Card</CardTitle>
          <CardContent className="pt-4">
            <p>
              This is a standard card with a title and content. Cards can contain
              text, images, buttons, and other components.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 p-6 border-accent">
          <CardTitle>Custom Card</CardTitle>
          <CardContent className="pt-4">
            <p className="mb-4">
              Cards can be customized with different borders, shadows, and styles.
            </p>
            <Button>Card Action</Button>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardTitle>Usage Example</CardTitle>
          <CardContent className="pt-4">
            <Code variant="block">{`import { Card, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";

export function MyCard() {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <CardTitle>My Card Title</CardTitle>
      <CardContent className="pt-4">
        <p className="mb-4">This is the card content.</p>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  );
}`}</Code>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="spinner">Spinner</h2>
        <p className="mb-6">
          The Spinner component is a customizable wheel that can be used for random selection,
          giveaways, or interactive user experiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <Card className="h-full p-6">
              <CardTitle>Basic Spinner</CardTitle>
              <CardContent className="pt-4 flex flex-col items-center">
                <div className="w-64 h-64 mb-4">
                  <Spinner 
                    segments={SAMPLE_SEGMENTS}
                    primaryColor="#4f46e5"
                    secondaryColor="#f97316"
                  />
                </div>
                <p className="text-center">
                  Basic spinner with default configuration.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full p-6">
              <CardTitle>Custom Colors</CardTitle>
              <CardContent className="pt-4 flex flex-col items-center">
                <div className="w-64 h-64 mb-4">
                  <Spinner 
                    segments={SAMPLE_SEGMENTS}
                    primaryColor="#10b981"
                    secondaryColor="#f43f5e"
                  />
                </div>
                <p className="text-center">
                  Spinner with custom primary and secondary colors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="p-6">
          <CardTitle>Usage Example</CardTitle>
          <CardContent className="pt-4">
            <Code variant="block">{`import { useState } from "react";
import { Spinner } from "@repo/spinner";
import type { SpinnerSegment } from "@repo/spinner";

export function SpinnerExample() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<SpinnerSegment | null>(null);
  
  const segments: SpinnerSegment[] = [
    { id: "1", label: "Prize 1", value: "100" },
    { id: "2", label: "Prize 2", value: "200" },
    { id: "3", label: "Prize 3", value: "300" },
    { id: "4", label: "Prize 4", value: "400" },
  ];
  
  const handleSpinEnd = (winnerSegment: SpinnerSegment) => {
    setWinner(winnerSegment);
    setIsSpinning(false);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-72 h-72 mb-4">
        <Spinner
          segments={segments}
          duration={5}
          primaryColor="#4f46e5"
          secondaryColor="#f97316"
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
          showWinner={true}
        />
      </div>
      
      <button 
        onClick={() => setIsSpinning(true)}
        disabled={isSpinning}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
      
      {winner && (
        <div className="mt-4 text-center">
          <p>Winner: {winner.label}</p>
          <p>Value: {winner.value}</p>
        </div>
      )}
    </div>
  );
}`}</Code>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="theme">Theme Toggle</h2>
        <p className="mb-6">
          The Theme Toggle component allows users to switch between light and dark themes.
        </p>

        <Card className="mb-8 p-6">
          <CardTitle>Theme Toggle Example</CardTitle>
          <CardContent className="pt-4 flex justify-center">
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardTitle>Usage Example</CardTitle>
          <CardContent className="pt-4">
            <Code variant="block">{`import { ThemeProvider } from "@repo/ui/theme-provider";
import { ThemeToggle } from "@repo/ui/theme-toggle";

export function Layout({ children }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme-preference">
      <header className="flex justify-between items-center p-4">
        <h1>My App</h1>
        <ThemeToggle />
      </header>
      <main>{children}</main>
    </ThemeProvider>
  );
}`}</Code>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6" id="code">Code</h2>
        <p className="mb-6">
          The Code component is used to display code snippets with proper formatting.
        </p>

        <Card className="mb-8 p-6">
          <CardTitle>Inline Code</CardTitle>
          <CardContent className="pt-4">
            <p>
              This is a paragraph with <Code variant="inline">inline code</Code> embedded within text.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 p-6">
          <CardTitle>Block Code</CardTitle>
          <CardContent className="pt-4">
            <Code variant="block">{`function helloWorld() {
  console.log("Hello, world!");
  return true;
}`}</Code>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardTitle>Usage Example</CardTitle>
          <CardContent className="pt-4">
            <Code variant="block">{`import { Code } from "@repo/ui/code";

export function CodeExample() {
  return (
    <div>
      <p>
        Here is some <Code variant="inline">inline code</Code> in a paragraph.
      </p>
      
      <Code variant="block">\`\`\`js
function example() {
  return "This is a code block";
}
\`\`\`</Code>
    </div>
  );
}`}</Code>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}