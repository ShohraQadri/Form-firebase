// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

import { IoTrashBin, IoPencil } from 'react-icons/io5';
function ContactForm() {
    const [User, setUser] = useState({
        name: '',
        email: '',
        message: '',
        id: ''
    });
    // use state
    const [val, setVal] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const getUserData = (e) => {
        const { name, value } = e.target;
        setUser({ ...User, [name]: value });
    };

    const postData = async (e) => {
        e.preventDefault();

        const { name, email, message, id } = User;

        if (name && email && message) {
            let response;
            if (isEditing) {
                // Update existing item
                response = await fetch(`https://contentform-e3351-default-rtdb.firebaseio.com/createform/${id}.json`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        message
                    })
                });
            } else {
                // Create new item
                response = await fetch('https://contentform-e3351-default-rtdb.firebaseio.com/createform.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        message
                    })
                });
            }
            // Reset edit after submission
            if (response.ok) {
                setUser({
                    name: '',
                    email: '',
                    message: '',
                    id: ''
                });
                alert(isEditing ? 'Update Successful' : 'Submit Successfully');
                formReset();
                getData();
                setIsEditing(false);
            } else {
                alert(`Failed to ${isEditing ? 'update' : 'submit'}. Please try again.`);
            }
        } else {
            alert('Please fill out the form');
        }
    };

    const getData = async () => {
        const response = await fetch('https://contentform-e3351-default-rtdb.firebaseio.com/createform.json');
        const data = await response.json();
        const dataArray = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setVal(dataArray);
    };

    useEffect(() => {
        getData();
    }, []);

    const formReset = () => {
        setUser({
            name: '',
            email: '',
            message: '',
            id: ''
        });
    };

    const handleDelete = async (id) => {
        const response = await fetch(`https://contentform-e3351-default-rtdb.firebaseio.com/createform/${id}.json`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Delete Successful');
            getData();
        } else {
            alert('Failed to delete. Please try again.');
        }
    };

    const handleEdit = (id) => {
        const editedItem = val.find((item) => item.id === id);

        if (editedItem) {
            setUser({
                name: editedItem.name,
                email: editedItem.email,
                message: editedItem.message,
                id: id
            });
            setIsEditing(true);
        }
    };
    const totalCount = val.length;
    return (
        <div className='mx-2 '>
            <h1 className='text-center font-bold text-black-400 text-2xl mt-8'>Form</h1>
            <form className="max-w-md mx-auto border-2 p-2 mt-3" method="POST">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        required
                        value={User.name}
                        onChange={getUserData}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        required
                        value={User.email}
                        onChange={getUserData}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="message"
                        placeholder="Enter your message"
                        name="message"
                        rows="4"
                        required
                        value={User.message}
                        onChange={getUserData}
                    ></textarea>
                </div>
                {/* submit and update button */}
                <button
                    className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    onClick={postData}
                >
                    {isEditing ? 'Update' : 'Submit'}
                </button>
            </form>
            {/* data count */}
            <div className="text-center text-gray-500 font-bold mb-4 mt-4 ">
                Total Count: {totalCount}
            </div>
            {val.map((value) => (
                <div key={value.id} className='my-3 flex-col lg:flex-row gap-1 lg:items-center flex justify-between border-2 max-w-md p-2  m-auto'>
                    <div className='lg:basis-32 basis-0 grow text-base'>
                        <h1 className=' font-semiBold capitalize'>Name: <span className='font-base'>{value.name}</span></h1>
                        <h1 className=' font-semiBold capitalize'>Email: <span className='font-base'>{value.email}</span></h1><h1 className=' font-base capitalize'>Message: <span className='font-base'>{value.message}</span></h1>

                    </div>
                    {/* delete and edit b utton */}
                    <div className='buttons flex mt-2 gap-1'>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                            type="submit" onClick={() => handleDelete(value.id)} > <p className='flex  gap-2 items-center justify-around'>  <span>Delete</span> <span><IoTrashBin /></span> </p>
                        </button>
                        <button className="bg-green-500 ms-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit" onClick={() => handleEdit(value.id)}><p className='flex gap-2 items-center justify-around'><span>Edit</span><span> <IoPencil /></span></p>
                        </button>
                    </div>
                </div >
            ))
            }
        </div>
    );
}

export default ContactForm;
