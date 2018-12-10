import React from "react";

const Key = ({ k }) => <label className="form-key">{k}</label>;
const Value = ({ v }) => <span className="form-value">{v}</span>;

const handleToggleFormHighlight = form => {
  window.parent.postMessage(
    {
      action: "TOGGLE_FORM_HIGHLIGHT",
      payload: { id: form.id, idType: form.idType }
    },
    "*"
  );
};

const Form = ({ form }) => (
  <ul
    className="detected-form"
    onMouseEnter={() => handleToggleFormHighlight(form)}
    onMouseLeave={() => handleToggleFormHighlight(form)}
  >
    <h2>{form.id}</h2>
    {form.data.map(e => {
      return (
        <li key={e.name}>
          <Key k={e.name} />
          <Value v={e.value} />
        </li>
      );
    })}
  </ul>
);

const DetectedForms = ({ forms }) => {
  return forms.map(f => {
    return <Form key={f.id} form={f} />;
  });
};

export default DetectedForms;
