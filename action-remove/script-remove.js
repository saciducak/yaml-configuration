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
        if (action.type === 'remove') {
            removeElement(action.selector);
        }
    });
}

function removeElement(selector) {
    document.querySelectorAll(selector).forEach(el => el.remove());
}

async function loadAndApplyConfigurations() {
    const config = await loadYAMLFile('config-remove.yaml');
    applyActions(config ? config.actions : []);
}

document.addEventListener('DOMContentLoaded', loadAndApplyConfigurations);
