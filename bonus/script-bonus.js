// Sample YAML configuration (this would be fetched from your server in a real application)
const yamlConfig = `
datasource:
  pages:
    home: home-config.yaml
    about: about-config.yaml
    contact: contact-config.yaml

  urls:
    /products: products-config.yaml
    /orders: orders-config.yaml

  hosts:
    example.com: example-config.yaml
    another.com: another-config.yaml
`;

// Mock function to simulate fetching YAML files
function fetchYAML(fileName) {
    const mockData = {
        'home-config.yaml': `
title: "Home Page Configuration"
description: "Configuration details for the home page."
`,
        'about-config.yaml': `
title: "About Page Configuration"
description: "Configuration details for the about page."
`,
        'contact-config.yaml': `
title: "Contact Page Configuration"
description: "Configuration details for the contact page."
`,
        'products-config.yaml': `
title: "Products Page Configuration"
description: "Configuration details for the products page."
`,
        'orders-config.yaml': `
title: "Orders Page Configuration"
description: "Configuration details for the orders page."
`,
        'example-config.yaml': `
title: "Example Host Configuration"
description: "Configuration details for example.com."
`,
        'another-config.yaml': `
title: "Another Host Configuration"
description: "Configuration details for another.com."
`
    };
    return mockData[fileName];
}

// Parse YAML configuration
const config = jsyaml.load(yamlConfig);

// Debugging: Check the structure of the config object
console.log('Config:', config);

function applyConfig() {
    const currentPage = window.location.pathname.substring(1) || 'home'; // Default to 'home' if pathname is empty
    const host = window.location.hostname;

    let configFile = '';
    let message = '';

    console.log('Current Page:', currentPage);
    console.log('Host:', host);

    // Check for URL-specific configuration
    if (config.urls && config.urls[currentPage]) {
        configFile = config.urls[currentPage];
    }
    // Check for host-specific configuration
    else if (config.hosts && config.hosts[host]) {
        configFile = config.hosts[host];
    } else {
        // Check for page-specific configuration
        if (config.datasource && config.datasource.pages && config.datasource.pages[currentPage]) {
            configFile = config.datasource.pages[currentPage];
        } else {
            message = 'No configuration found for this page or host.';
            document.getElementById('config-output').innerText = message;
            return;
        }
    }

    console.log('Config File:', configFile);

    // Fetch and apply the configuration
    const yamlContent = fetchYAML(configFile);
    if (yamlContent) {
        const parsedContent = jsyaml.load(yamlContent);
        message = `
            Title: ${parsedContent.title}
            Description: ${parsedContent.description}
        `;
    } else {
        message = 'Configuration file could not be loaded.';
    }
    document.getElementById('config-output').innerText = message;
}

// Call the function to apply the configuration
applyConfig();
