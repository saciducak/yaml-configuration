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
        if (action.type === 'insert') {
            insertElement(action.position, action.target, action.element);
        }
    });
}

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

async function loadAndApplyConfigurations() {
    const config = await loadYAMLFile('config-insert.yaml');
    applyActions(config ? config.actions : []);
}

document.addEventListener('DOMContentLoaded', loadAndApplyConfigurations);
