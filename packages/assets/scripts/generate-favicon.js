const { promises: fs } = require('fs');
const path = require('path');
const favicons = require('favicons').stream;

async function generateFavicons() {
  const logoPath = path.join(__dirname, '../images/logo.png');
  const outputPath = path.join(__dirname, '../favicons');
  
  // Ensure the favicons directory exists
  await fs.mkdir(outputPath, { recursive: true });

  try {
    // Check if logo file exists
    await fs.access(logoPath);
    
    console.log('Generating favicons...');

    const configuration = {
      path: '/assets/favicons', // Path for the favicons when hosted
      appName: 'Winner Spinner',
      appShortName: 'WinnerSpinner',
      appDescription: 'A customizable spinner for raffle winners',
      developerName: 'BetterMadeTech',
      developerURL: 'https://bettermadetech.com',
      background: '#fff',
      theme_color: '#4F46E5',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: false,
        windows: true,
        yandex: false
      }
    };

    // Use favicons API properly with promises
    const response = await new Promise((resolve, reject) => {
      const images = [];
      const files = [];
      const html = [];

      favicons(logoPath, configuration)
        .on('error', reject)
        .on('data', (data) => {
          if (data.name.endsWith('.png') || data.name.endsWith('.ico') || data.name.endsWith('.svg')) {
            images.push({ name: data.name, contents: data.contents });
          } else if (data.name.endsWith('.webmanifest') || data.name.endsWith('.xml')) {
            files.push({ name: data.name, contents: data.contents });
          } else if (data.name === 'html') {
            html.push(data.contents.toString());
          }
        })
        .on('end', () => resolve({ images, files, html }));
    });

    // Save the generated files
    for (const image of response.images) {
      await fs.writeFile(path.join(outputPath, image.name), image.contents);
      console.log(`Generated favicon image: ${image.name}`);
    }

    for (const file of response.files) {
      await fs.writeFile(path.join(outputPath, file.name), file.contents);
      console.log(`Generated favicon file: ${file.name}`);
    }

    // Create a manifest JSON with info about generated favicons
    const manifest = {
      faviconFiles: response.images.map(image => image.name),
      htmlCode: response.html,
      metaFiles: response.files.map(file => file.name)
    };

    await fs.writeFile(
      path.join(outputPath, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('Favicon generation complete! Files saved to packages/assets/favicons/');
    console.log('HTML tags to include:');
    console.log(response.html.join('\n'));
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

// Execute the function
generateFavicons();