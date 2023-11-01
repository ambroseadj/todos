'use client'

import { DatePicker } from 'antd';
import { db } from './firebaseConfig'
import {collection, addDoc, getDocs, deleteDoc, serverTimestamp, query, orderBy, doc,updateDoc} from 'firebase/firestore'
import { useState,useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';

import moment from 'moment';



async function addTodoToFirebase(title,details,dueDate){

  try{
    const docRef = await addDoc(collection(db, "todos"),{
      title:title,
      details:details,
      duedate:dueDate,
      createdAt: serverTimestamp(),
    });
    console.log("Todo added with ID:",docRef.id);
    return true;
  }catch(error){
      console.error("Error adding todo:",error);
      return false;
    }
  }


  async function fetchTodosFromFirestore(){
    const todosCollection = collection(db,"todos");
    const querySnapshot= await getDocs(query(todosCollection, orderBy("createdAt","desc" )));
    const todos= [];
    querySnapshot.forEach((doc) =>{
      const todoData= doc.data();
      todos.push({id: doc.id, ...todoData});
    });

    return todos;
    
  }
  

  async function deleteTodoFromFirestore(todoId){
    try{
      console.log("Attempting to delete todo with Id: ", todoId);
      await deleteDoc(doc(db,"todos",todoId));
      return todoId;
      
      
    }catch(error){
      console.error("error deleting todo")
      return null;
    }
  }

export default function Home() {


  const [title,setTitle]= useState("");
  const [details,setDetails]= useState("");
  const [dueDate,setDueDate]=useState("");

  const [todos,setTodos]= useState([]);

  const[selectedTodo,setSelectedTodo]= useState(null);
  const[isUpdateMode, setIsUpdateMode]= useState(false);

  const handleSubmit= async(e)=>{
    e.preventDefault();
    if(isUpdateMode){
      if (selectedTodo){
        try{
          const updatedTodo={
            title,
            details,
            dueDate,
          };

          const todoRef = doc(db, "todos",selectedTodo.id) ;
          await updateDoc(todoRef,updatedTodo);
          setTitle("");
          setDetails("");
          setDueDate("");
          setSelectedTodo(null);
          setIsUpdateMode(false);


          alert("Todo updated succesfully")
        }catch(error){
          console.error("error updateing :",error);

        }
      }
    }else{
      const added= await addTodoToFirebase(title,details,dueDate);
      if(added){
        setTitle("");
        setDetails("");
        setDueDate("");
        alert(" todo added to direstore successfully")
      }
    }
  };



  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const updatedTodos = [];
      snapshot.forEach((doc) => {
        updatedTodos.push({ id: doc.id, ...doc.data() });
      });
      setTodos(updatedTodos);
    });
  
    return () => unsubscribe();
  }, []);
  


  const handleUpdateClick =(todo) =>{
    setTitle(todo.title || "");
    setDetails(todo.details || "");
    setDueDate(todo.dueDate || "");
setSelectedTodo(todo);
setIsUpdateMode(true);


useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
    const updatedTodos = [];
    snapshot.forEach((doc) => {
      updatedTodos.push({ id: doc.id, ...doc.data() });
    });
    setTodos(updatedTodos);
  });

  return () => unsubscribe();
}, []);



  }
  return (
   
    <main className="flex flex-1 items-center justify-center flex-col md:flex-row min-h-screen ">
      <section className='flex-1 flex md:flex-col items-center md:justify-start mx-auto '>
      <div className='absolute top-4 left-4'>
      </div>
      <div className='p-6 md:p-12 mt-10 rounded-lg shadow-x1 w-full max-w-lg bg-white'>
        <h1 className='text-center text-2xl font-bold leading-9 text-gray-900 '>
          {isUpdateMode? "Update your Todo":"Create a todo"}
        </h1>
        <form className='mt-6 space-y-6 ' onSubmit={handleSubmit}>
<div>
  <label htmlFor='details' className='block text-sm font-medium leading-6 text'>
    Title{todos.id}
  </label>
  <div className='mt-2 '>
    <input
    id="title"
    name="title"
    type="text"
    autoComplete='="off'
    required
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
      className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring' 
      />
       </div>
       <div>
       <label htmlFor='details' className='block text-sm font-medium leading-6 text'>
    Details
  </label>
  <div className='mt-2 '>
    <textarea
    id="details"
    name="details"
    rows="4"
    type="text"
    autoComplete='="off'
    required
    value={details}
    onChange={(e)=>setDetails(e.target.value)}
      className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring' 
      />
</div>
<label htmlFor='dueDate' className='block text-sm font-medium leading-6 text'>
    Due Date
  </label>

  <div className='mt-2 '>
  <DatePicker
  id="dueDate"
  name="dueDate"
  format="YYYY-MM-DD"
  value={dueDate ? moment(dueDate, 'YYYY-MM-DD') : null}
  onChange={(date, dateString) => setDueDate(dateString)}
  className='w-full rounded border py-2 pl-2 text-gray-900 shadow ring'
/>

</div>
       </div>
</div >
<div>


  
  <button
  type="submit"
  className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700'>


    {isUpdateMode?"Update":"Create"}
  </button>
</div>
        </form>
      </div>
      </section>







      <section className='md:w-1/2 md:max-h-screen overflow-y-auto md:ml-10 mt-20 mx-auto'>
        <div className='p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-white'>
        <h2 className='text-center text-2xl font-bold leading-9 text-gray-900'>
          Todo List
        </h2>
        
        <div className='mt-6 space-y-6'>
     
          {todos.map((todo)=>(
            <div key={todo.id} className='border p-4 rounded-md shadow-md'>
              
              <h3 className='text-lg font-semibold text-gray-900 break-words'>{todo.title}</h3>
                <p >
                  {todo.details}
                </p>
    <p className='text-gray-700 multiline break-words'>
    Due date: {todo.duedate}
    </p>
<div className='mt-4 space-x-6'>
  
  <button 
  type='button'
  className='px-3 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md'
    onClick={()=> handleUpdateClick(todo)}>Update
  </button>
  <button
  
  type= 'button'
  onClick={async()=>{
    const deletedTodoId = await deleteTodoFromFirestore(todo.id);
    
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      const updatedTodos = [];
      snapshot.forEach((doc) => {
        updatedTodos.push({ id: doc.id, ...doc.data() });
      });
      setTodos(updatedTodos);
    });
  
    return () => unsubscribe();
  }, []);
    if(deletedTodoId){
      const updatedTodos = todos.filter((t) => todo.id!== deletedTodoId);
      setTodos(updatedTodos);

    }
  }}
  className='px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md'>

    Delete
  </button>
</div>
             
</div>
          ))}

        </div>
        </div>
      </section>
    </main>
   
  )
}
