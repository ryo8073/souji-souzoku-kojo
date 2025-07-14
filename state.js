// グローバル変数としてtemplatesを定義
const templates = window.templates || [];

function createStore(initialState) {
    let state = initialState;
    const listeners = new Set();

    const proxy = new Proxy(state, {
        set(target, property, value) {
            target[property] = value;
            listeners.forEach((listener) => listener(state));
            return true;
        },
    });

    function subscribe(listener) {
        listeners.add(listener);
        listener(state); // Immediately invoke with current state
        return () => listeners.delete(listener); // Unsubscribe function
    }

    // --- Actions ---
    // Actions are functions that modify the state.
    // They are part of the store to keep logic centralized.

    function applyTemplate(templateId) {
        const template = templates.find(t => t.id === templateId);
        if (!template) {
            console.error(`Store: Template with ID ${templateId} not found.`);
            return;
        }

        proxy.currentTemplateId = template.id;
        proxy.currentHeirs = template.heirs;
        proxy.familyTreeNodes = template.nodes;
        proxy.familyTreeEdges = template.edges;
        proxy.calculationResult = null; // Reset calculation
        
        // Set the first heir's data by default
        const defaultHeir = template.heirs?.[0];
        if (defaultHeir) {
            setSelectedHeir(defaultHeir.id);
        } else {
            proxy.selectedHeirId = null;
            proxy.formValues = { A: 0, B: 0, C: 0, D: 0, E: 0 };
        }
    }

    function setSelectedHeir(heirId) {
        const heir = proxy.currentHeirs.find(h => h.id === heirId);
        if (!heir) {
            console.error(`Store: Heir with ID ${heirId} not found.`);
            return;
        }
        proxy.selectedHeirId = heir.id;
        proxy.formValues = {
            A: heir.A,
            B: heir.B,
            C: heir.C,
            D: heir.D,
            E: heir.E,
        };
        proxy.calculationResult = null; // Reset calculation
    }

    function updateFormValues(newValues) {
        proxy.formValues = { ...proxy.formValues, ...newValues };
    }

    function calculate() {
        try {
            const result = window.Calculator.calculateDeduction(proxy.formValues);
            proxy.calculationResult = result;
        } catch (error) {
            console.error(`Calculation failed: ${error.message}`);
            proxy.calculationResult = { finalAmount: 0, steps: [] }; // Set a default error state
        }
    }

    return {
        subscribe,
        actions: {
            applyTemplate,
            setSelectedHeir,
            updateFormValues,
            calculate,
        }
    };
}

// --- Initial State Setup ---
const defaultTemplate = templates.find(t => t.default) || templates[0];
const defaultHeir = defaultTemplate?.heirs?.[0];

const initialState = {
    currentTemplateId: defaultTemplate?.id || 'default',
    currentHeirs: defaultTemplate?.heirs || [],
    selectedHeirId: defaultHeir?.id || null,
    formValues: defaultHeir ? {
        A: defaultHeir.A,
        B: defaultHeir.B,
        C: defaultHeir.C,
        D: defaultHeir.D,
        E: defaultHeir.E,
    } : { A: 0, B: 0, C: 0, D: 0, E: 0 },
    calculationResult: null,
    familyTreeNodes: defaultTemplate?.nodes || [],
    familyTreeEdges: defaultTemplate?.edges || [],
};

// グローバル変数としてエクスポート
window.store = createStore(initialState); 