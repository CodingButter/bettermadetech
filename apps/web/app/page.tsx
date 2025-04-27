import React from "react";
import Image, { type ImageProps } from "next/image";
import { Button, Card, CardTitle, CardContent, Code } from "@repo/ui";
import styles from "./page.module.css";
import { SpinnerContainer } from "./client-container";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, className, ...rest } = props;

  return (
    <>
      <Image 
        {...rest} 
        src={srcLight} 
        className={`imgLight ${className || ""}`} 
        data-theme-image
      />
      <Image 
        {...rest} 
        src={srcDark} 
        className={`imgDark ${className || ""}`} 
        data-theme-image
      />
    </>
  );
};

const Home: React.FC = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        
        <h1 className="text-3xl font-bold mt-6 mb-2">Better Made Tech</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Welcome to the Better Made Tech demo site
        </p>

        <section className="mb-16 w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Winner Spinner Demo</h2>
          <Card className="p-6">
            <CardContent className="p-0">
              <SpinnerContainer />
            </CardContent>
          </Card>
        </section>

        <section className="mb-16 w-full max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">UI Components</h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">
                Default Button
              </Button>
              <Button variant="destructive">
                Destructive Button
              </Button>
              <Button variant="outline">
                Outline Button
              </Button>
              <Button variant="accent" size="xl">
                Accent Button
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card hoverable className="p-6">
                <CardTitle>Card Title</CardTitle>
                <CardContent className="pt-4">
                  This is a hoverable card using Tailwind CSS v4.1 features.
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardTitle>Code Example</CardTitle>
                <CardContent className="pt-4">
                  <Code variant="block">{`function hello() {
  console.log("Hello world!");
}`}</Code>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <div className={styles.ctas}>
          <a
            href="/docs"
            className={styles.primary}
          >
            <Image
              className={styles.logo}
              src="/file-text.svg"
              alt="Docs icon"
              width={20}
              height={20}
            />
            View Documentation
          </a>
          <a
            href="https://github.com/CodingButter/bettermadetech"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            GitHub Repository
          </a>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <a
          href="https://github.com/CodingButter/bettermadetech"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          GitHub
        </a>
        <p>
          © {new Date().getFullYear()} Better Made Tech
        </p>
      </footer>
    </div>
  );
};

export default Home;