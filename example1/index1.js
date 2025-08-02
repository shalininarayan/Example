export const generateIndexJsFile = (componentName = "GeneratedComponent", columns = []) => {
  const controlImports = new Set();
  const fieldJSX = columns.map((col) => {
    let controlJSX = "";

    switch (col.controlType) {
      case "text":
        controlImports.add("InputText");
        controlJSX = `<InputText value={form.${col.label} || ''} onChange={(e) => handleChange('${col.label}', e.target.value)} className="w-full" />`;
        break;
      case "date":
        controlImports.add("Calendar");
        controlJSX = `<Calendar value={form.${col.label}} onChange={(e) => handleChange('${col.label}', e.value)} className="w-full" />`;
        break;
      case "select":
        controlImports.add("Dropdown");
        controlJSX = `<Dropdown value={form.${col.label}} options={${col.label}Options} onChange={(e) => handleChange('${col.label}', e.value)} className="w-full" />`;
        break;
      default:
        controlJSX = `<InputText value={form.${col.label} || ''} onChange={(e) => handleChange('${col.label}', e.target.value)} className="w-full" />`;
        break;
    }

    return `
      <div className="mb-3">
        <label className="block font-medium mb-1">${col.fieldName}${col.mandatory ? ' *' : ''}</label>
        ${controlJSX}
      </div>`;
  }).join("\n");

  const importLines = Array.from(controlImports)
    .map(control => `import { ${control} } from 'primereact/${control.toLowerCase()}';`)
    .join("\n");

  return `import React, { useState } from "react";
          import 'primereact/resources/themes/lara-light-blue/theme.css';
          import 'primereact/resources/primereact.min.css';
          import 'primeicons/primeicons.css';
          import { InputText } from 'primereact/inputtext';  
${importLines}

const ${componentName} = () => {
  const [form, setForm] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">${componentName}</h2>
      <form>
        ${fieldJSX}
        <button type="submit" className="mt-4 p-button p-component p-button-primary">Submit</button>
      </form>
    </div>
  );
};

export default ${componentName};
`;
};
