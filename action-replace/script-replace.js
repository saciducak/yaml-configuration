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
        if (action.type === 'replace') {
            replaceElement(action.selector, action.newElement);
        }
    });
}

function replaceElement(selector, newElement) {
    document.querySelectorAll(selector).forEach(el => {
        const temp = document.createElement('div');
        temp.innerHTML = newElement;
        el.replaceWith(temp.firstElementChild);
    });
}

async function loadAndApplyConfigurations() {
    const config = await loadYAMLFile('config-replace.yaml');
    applyActions(config ? config.actions : []);
}

document.addEventListener('DOMContentLoaded', loadAndApplyConfigurations);
