async function loadYAMLFile(filePath) {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        return jsyaml.load(text);
    } catch (error) {
        console.error('Error loading YAML file:', error);
        return null;
    }
}

function applyActions(actions) {
    if (!actions) return;
    actions.forEach(action => {
        if (action.type === 'alter') {
            alterTextContent(action.oldValue, action.newValue);
        }
    });
}

/**
 * Replace old text with new text in all text nodes within the document.
 * @param {string} oldValue - The text to be replaced.
 * @param {string} newValue - The text to replace with.
 */
function alterTextContent(oldValue, newValue) {
    // Traverse the entire document to find and replace text nodes
    function traverseNodes(node) {
        if (node.nodeType === 3) { // Text node
            if (node.nodeValue.includes(oldValue)) {
                node.nodeValue = node.nodeValue.replace(new RegExp(oldValue, 'g'), newValue);
            }
        } else if (node.nodeType === 1 && node.childNodes) { // Element node
            Array.from(node.childNodes).forEach(child => traverseNodes(child));
        }
    }
    
    // Start traversal from the document body
    traverseNodes(document.body);
}


async function loadAndApplyConfigurations() {
    const config = await loadYAMLFile('config-alter.yaml');
    applyActions(config ? config.actions : []);
}

document.addEventListener('DOMContentLoaded', loadAndApplyConfigurations);
