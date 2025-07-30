import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, Edit3, GripVertical } from 'lucide-react';

const FORM_ELEMENTS = {
  TEXT: {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
    defaultProps: {
      label: 'Text Field',
      placeholder: 'Enter text...',
      required: false
    }
  },
  EMAIL: {
    type: 'email',
    label: 'Email Input',
    icon: '📧',
    defaultProps: {
      label: 'Email',
      placeholder: 'Enter email...',
      required: true
    }
  },
  NUMBER: {
    type: 'number',
    label: 'Number Input',
    icon: '🔢',
    defaultProps: {
      label: 'Number Field',
      placeholder: '0',
      min: 0,
      max: 100
    }
  },
  SELECT: {
    type: 'select',
    label: 'Dropdown',
    icon: '⬇️',
    defaultProps: {
      label: 'Select Option',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  RADIO: {
    type: 'radio',
    label: 'Radio Group',
    icon: '🔘',
    defaultProps: {
      label: 'Choose One',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  CHECKBOX: {
    type: 'checkbox',
    label: 'Checkbox Group',
    icon: '☑️',
    defaultProps: {
      label: 'Select Multiple',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  CALCULATOR: {
    type: 'calculator',
    label: 'Calculator',
    icon: '🧮',
    defaultProps: {
      label: 'Calculator Field',
      formula: 'a + b',
      variables: ['a', 'b'],
      resultLabel: 'Result'
    }
  },
  FILE: {
    type: 'file',
    label: 'File Upload',
    icon: '📁',
    defaultProps: {
      label: 'Upload File',
      accept: 'image/*,application/pdf',
      multiple: false
    }
  }
};

function SortableFormElement({ element, index, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 group hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical size={16} className="text-gray-400" />
          </div>
          <span className="text-lg">{FORM_ELEMENTS[element.type]?.icon}</span>
          <span className="font-medium">{element.label}</span>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(element)}
            className="p-1 hover:bg-blue-100 rounded"
          >
            <Edit3 size={16} className="text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(element.id)}
            className="p-1 hover:bg-red-100 rounded"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Element Preview */}
      <FormElementPreview element={element} />
    </div>
  );
}

function FormElementPreview({ element }) {
  const props = element.props || {};

  switch (element.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <input
          type={element.type}
          placeholder={props.placeholder}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 pointer-events-none"
          disabled
        />
      );
    
    case 'select':
      return (
        <select className="w-full p-2 border border-gray-300 rounded bg-gray-50 pointer-events-none" disabled>
          {props.options?.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>
      );
    
    case 'radio':
      return (
        <div className="space-y-2">
          {props.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-2 pointer-events-none">
              <input type="radio" name={`preview-${element.id}`} disabled />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="space-y-2">
          {props.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-2 pointer-events-none">
              <input type="checkbox" disabled />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    
    case 'calculator':
      return (
        <div className="space-y-2">
          {props.variables?.map((variable, i) => (
            <div key={i} className="flex items-center gap-2">
              <label className="min-w-[40px]">{variable}:</label>
              <input
                type="number"
                className="flex-1 p-2 border border-gray-300 rounded bg-gray-50 pointer-events-none"
                disabled
              />
            </div>
          ))}
          <div className="text-sm text-gray-600">Formula: {props.formula}</div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded font-medium">
            {props.resultLabel}: [Calculated Result]
          </div>
        </div>
      );
    
    case 'file':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
          <span className="text-gray-600">Click to upload or drag and drop</span>
        </div>
      );
    
    default:
      return <div className="text-gray-500 italic">Unknown element type</div>;
  }
}

export default function FormBuilder({ onFormChange }) {
  const [formElements, setFormElements] = useState([]);
  const [editingElement, setEditingElement] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = formElements.findIndex(el => el.id === active.id);
      const newIndex = formElements.findIndex(el => el.id === over.id);
      const newElements = arrayMove(formElements, oldIndex, newIndex);
      setFormElements(newElements);
      onFormChange?.(newElements);
    }
  };

  const addElement = (elementType) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      label: FORM_ELEMENTS[elementType].defaultProps.label,
      props: { ...FORM_ELEMENTS[elementType].defaultProps }
    };
    
    const newElements = [...formElements, newElement];
    setFormElements(newElements);
    onFormChange?.(newElements);
    setEditingElement(newElement);
  };

  const editElement = (element) => {
    setEditingElement(element);
  };

  const saveElement = (updatedElement) => {
    const newElements = formElements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    setFormElements(newElements);
    onFormChange?.(newElements);
    setEditingElement(null);
  };

  const deleteElement = (elementId) => {
    const newElements = formElements.filter(el => el.id !== elementId);
    setFormElements(newElements);
    onFormChange?.(newElements);
  };

  return (
    <div className="flex gap-6">
      {/* Element Palette */}
      <div className="w-64 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Form Elements</h3>
        <div className="space-y-2">
          {Object.entries(FORM_ELEMENTS).map(([key, element]) => (
            <button
              key={key}
              onClick={() => addElement(key)}
              className="w-full flex items-center gap-3 p-3 bg-white rounded border hover:shadow-sm transition-shadow"
            >
              <span className="text-xl">{element.icon}</span>
              <span className="text-sm font-medium">{element.label}</span>
              <Plus size={16} className="ml-auto text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Form Canvas */}
      <div className="flex-1">
        <div className="bg-white p-6 rounded-lg border min-h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Form Builder</h3>
            <span className="text-sm text-gray-600">
              {formElements.length} elements
            </span>
          </div>

          {formElements.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p>Drag elements from the left to start building your form</p>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formElements.map(el => el.id)}
                strategy={verticalListSortingStrategy}
              >
                {formElements.map((element, index) => (
                  <SortableFormElement
                    key={element.id}
                    element={element}
                    index={index}
                    onEdit={editElement}
                    onDelete={deleteElement}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Element Editor Modal */}
      {editingElement && (
        <ElementEditor
          element={editingElement}
          onSave={saveElement}
          onCancel={() => setEditingElement(null)}
        />
      )}
    </div>
  );
}

function ElementEditor({ element, onSave, onCancel }) {
  const [editedElement, setEditedElement] = useState({ ...element });

  const updateProp = (key, value) => {
    setEditedElement(prev => ({
      ...prev,
      props: { ...prev.props, [key]: value }
    }));
  };

  const updateLabel = (label) => {
    setEditedElement(prev => ({ ...prev, label }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h4 className="font-semibold mb-4">
          Edit {FORM_ELEMENTS[element.type]?.label}
        </h4>

        <div className="space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              value={editedElement.label}
              onChange={(e) => updateLabel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Type-specific properties */}
          {(element.type === 'text' || element.type === 'email') && (
            <div>
              <label className="block text-sm font-medium mb-1">Placeholder</label>
              <input
                type="text"
                value={editedElement.props.placeholder || ''}
                onChange={(e) => updateProp('placeholder', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          {element.type === 'number' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Min Value</label>
                <input
                  type="number"
                  value={editedElement.props.min || ''}
                  onChange={(e) => updateProp('min', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Value</label>
                <input
                  type="number"
                  value={editedElement.props.max || ''}
                  onChange={(e) => updateProp('max', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}

          {(element.type === 'select' || element.type === 'radio' || element.type === 'checkbox') && (
            <div>
              <label className="block text-sm font-medium mb-1">Options (one per line)</label>
              <textarea
                value={editedElement.props.options?.join('\n') || ''}
                onChange={(e) => updateProp('options', e.target.value.split('\n').filter(Boolean))}
                className="w-full p-2 border border-gray-300 rounded h-24"
              />
            </div>
          )}

          {element.type === 'calculator' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Formula</label>
                <input
                  type="text"
                  value={editedElement.props.formula || ''}
                  onChange={(e) => updateProp('formula', e.target.value)}
                  placeholder="e.g., a + b * 0.1"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Variables (comma separated)</label>
                <input
                  type="text"
                  value={editedElement.props.variables?.join(', ') || ''}
                  onChange={(e) => updateProp('variables', e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
                  placeholder="e.g., a, b, c"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Result Label</label>
                <input
                  type="text"
                  value={editedElement.props.resultLabel || ''}
                  onChange={(e) => updateProp('resultLabel', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}

          {/* Required checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editedElement.props.required || false}
              onChange={(e) => updateProp('required', e.target.checked)}
            />
            <label className="text-sm">Required field</label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => onSave(editedElement)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}