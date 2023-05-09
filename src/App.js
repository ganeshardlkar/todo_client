import React, { useState } from 'react';
import axios from 'axios';

const App = () => {

    const[todos, setTodos] = useState([]);
    const[text, setText] = useState('');
    const[newTodo, setNewTodo] = useState('');
    const[isEditing, setIsEditing] = useState(false);
    const[edit, setEdit] = useState('');
    const[editID, setEditID] = useState(0);

    const fetchData = async() => {
        const data = await axios.get('https://nodecrudapi-production.up.railway.app/api/v1/todos');
        const response = data.data.data;
        console.log(response);
        setTodos(response);
    }
    const handleClick = () => {
        fetchData();
    }

    const handleSearch = (e) => {
        setText(e.target.value);
    }

    const handleEntry = (e) => {
        setNewTodo(e.target.value);
    }

    const handleAdd = async () => {
        try {
            const response = await axios.post('https://nodecrudapi-production.up.railway.app/api/v1/create', { title: newTodo });
            fetchData();
            setNewTodo('');
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdit = async(id) => {
        console.log(id);
        setIsEditing(true);
        setEditID(id);
    }

    const handleDelete = async(id) => {
        try {
            console.log(id);
            const response = await axios.delete(`https://nodecrudapi-production.up.railway.app/api/v1/todos/${id}`);
            console.log(response);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditChange = (e) => {
        setEdit(e.target.value);
    }

    const handleSaveEditClick = async (id) => {
        try {
            const response = await axios.put(`https://nodecrudapi-production.up.railway.app/api/v1/todos/${id}`, { title: edit });
            console.log(response);
            setIsEditing(false);
            setEditID(0);
            setEdit('');
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <button onClick={handleClick}>Click to fetch all todos</button>
            <br/>
            <input placeholder='Search a todo' onChange={handleSearch} value={text}/>
            <br/>
            <input placeholder='Add a todo' onChange={handleEntry}value={newTodo}/>
            <button onClick={handleAdd}>Add</button>
            {   
                todos.filter((item) => {
                    return (
                        item.title.toLowerCase().includes(text.toLowerCase())
                    )
                }).map((item, i) => {
                    return (
                        <div key={i}>
                            <li>{item.title}</li>
                            {
                                isEditing && item._id === editID ? (
                                    <>
                                        <input value={edit} onChange={(e) => handleEditChange(e)}/>
                                        <button onClick={() => handleSaveEditClick(item._id)}>Save Edit</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEdit(item._id)}>Edit</button>
                                )
                            }
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default App