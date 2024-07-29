// Function to load and parse YAML file
async function loadYAMLFile(filePath) {
    try {
        const response = await fetch(filePath); // Fetch YAML file
        const text = await response.text(); // Get file content as text
        return jsyaml.load(text); // Parse YAML content
    } catch (error) {
        console.error('Error loading YAML file:', error);
        return null;
    }
}

// Function to apply actions defined in YAML file
function applyActions(actions) {
    if (!actions) return; // Return if no actions provided
    actions.forEach(action => {
        switch (action.type) {
            case 'replace':
                replaceElement(action.selector, action.newElement);
                break;
            case 'remove':
                removeElement(action.selector);
                break;
            case 'insert':
                insertElement(action.position, action.target, action.element);
                break;
            case 'alter':
                alterTextContent(action.oldValue, action.newValue);
                break;
            default:
                console.warn('Unknown action type:', action.type);
        }
    });
}

// Function to replace an element with new content
function replaceElement(selector, newElement) {
    document.querySelectorAll(selector).forEach(el => {
        const temp = document.createElement('div');
        temp.innerHTML = newElement;
        el.replaceWith(temp.firstElementChild);
    });
}

// Function to remove an element from the DOM
function removeElement(selector) {
    document.querySelectorAll(selector).forEach(el => el.remove());
}

// Function to insert a new element into the DOM
function insertElement(position, targetSelector, element) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const temp = document.createElement('div');
    temp.innerHTML = element;
    const newElement = temp.firstElementChild;

    if (position === 'before') {
        target.parentNode.insertBefore(newElement, target);
    } else if (position === 'after') {
        target.parentNode.insertBefore(newElement, target.nextSibling);
    } else {
        console.warn('Unknown insert position:', position);
    }
}

// Function to alter text content in the DOM
function alterTextContent(oldValue, newValue) {
    document.querySelectorAll('*').forEach(node => {
        if (node.nodeType === 3 && node.nodeValue.includes(oldValue)) {
            node.nodeValue = node.nodeValue.replace(new RegExp(oldValue, 'g'), newValue);
        }
    });
}

// Function to load configurations and apply actions
async function loadAndApplyConfigurations() {
    // Load multiple YAML configuration files
    const configs = ['config1.yaml', 'config2.yaml']; // Add more YAML files if needed
    for (const file of configs) {
        const config = await loadYAMLFile(file);
        applyActions(config ? config.actions : []);
    }
}

// Apply configurations after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadAndApplyConfigurations);
