import React, { useState } from 'react'
import Add from '../img/add.svg';
import Delete from '../img/delete.svg';

function KeyValueComponent({ saveFunction, initialKeyValues }) {
    const [keyValues, setKeyValues] = useState(initialKeyValues || [{ key: 1, value: "" }]);
    const [lastId, setLastId] = useState(1);

    const addRow = (e) => {
        e.preventDefault();
        const newfield = { key: keyValues.length + 1, value: "" }
        setLastId(keyValues.length + 1);
        setKeyValues([...keyValues, newfield]);
    }

    const deleteRow = (e, index) => {
        e.preventDefault();
        const newKeyValues = [...keyValues];
        newKeyValues.splice(index, 1);
        setLastId(keyValues.length - 1);
        setKeyValues(newKeyValues);
    }

    const handleKeyChange = (index, event) => {
        const newKeyValues = [...keyValues];
        newKeyValues[index].key = event.target.value;
        setKeyValues(newKeyValues);
    };

    const handleValueChange = (index, event) => {
        const newKeyValues = [...keyValues];
        newKeyValues[index].value = event.target.value;
        setKeyValues(newKeyValues);
        console.log(keyValues)
    };

    const handleSave = () => {
        keyValues.forEach((data) => {
            if(data.key && data.value){
                saveFunction(data);
            }
        });
    };

    return (
        <div>
            {keyValues.map(({ key, value }, index) => (
                <div key={index} className='flex question-row'>
                    <input
                        id="key"
                        type="text"
                        onChange={(e) => handleKeyChange(index, e)}
                        value={key}
                    />
                    <input
                        id="value"
                        type="text"
                        onChange={(e) => handleValueChange(index, e)}
                        value={value}
                    />
                    <div className='flex'>
                        <button onClick={addRow}>
                            <img src={Add} alt="Añadir una nueva pregunta" />
                        </button>
                        <button onClick={(e) => deleteRow(e, index)}>
                            <img src={Delete} alt="Borrar pregunta" />
                        </button>
                    </div>
                </div>
            ))
            }
            <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
        </div>

    )
}

export default KeyValueComponent;