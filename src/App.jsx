import React from 'react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'

const API = "https://repo.gozle.com.tm/eportalback/api/v1"
// const API = "http://localhost:4003/api/v1"

function App() {
  const [loading, setLoading] = React.useState(false)
  const [image, setImage] = React.useState()
  const [data, setData] = React.useState([])
  const [categories, setCategories] = React.useState([])

  const getData = async () => {
    const response = await axios.get(`${API}/news`)
    setData(response.data.news)
  }

  const getTrend = async () => {
    const response = await axios.get(`${API}/news/trend`)
    console.log(response.data);
  }


  const getCategroies = async () => {
    const response = await axios.get(`${API}/categories`)
    setCategories(response.data)
  }

  React.useEffect(() => {
      getData()
      getCategroies()
      getTrend()
  }, [])

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    // ------
    
    const title = e.target.title.value
    const description = e.target.description.value
    const sourceLink = e.target.sourceLink.value
    const sourceTitle = e.target.sourceTitle.value
    const categoryId = e.target.category.value
    const categoryName = categories.find((elem) => elem._id === categoryId)

    const formData = new FormData()
    formData.append("image", image)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('sourceTitle', sourceTitle)
    formData.append('sourceLink', sourceLink)
    formData.append('categoryId', categoryId)
    formData.append('categoryName', categoryName.name)

    const data = formData
    // await axios.post(`http://localhost:4003/api/v1/news`, data, {
      await axios.post(`${API}/news`, data, {
      // await axios.post(`${API}/categories`, data, {
      headers: {
        // "Content-Type": 'application/json'
        "Content-Type": 'multipart/form-data'
      }
    })
    
    
    // ------
    setLoading(false)
  }

  const handleSubmitCategory = async (e) => {
    e.preventDefault()
    const category = e.target.category.value
    const data = {
      name: category
    }
    await axios.post(`${API}/categories`, data, {
      headers: {
        "Content-Type": 'application/json'
      }
    })
  }
  const selectImage = (e) => {
    setImage(e.target.files[0])
  }

  const handleView = async (id) => {
    toast.success('pending data')
    await axios.put(`${API}/news/updateView/${id}`)
    setTimeout(() => {
      getData()
      toast.success('fetch success')
    }, 2000);  
  }

  const getByCategory = async (name) => {
    console.log(name);
    if(name === 0){
      const response = await axios.get(`${API}/news`)
      setData(response.data.news)
      return
    }
    const response = await axios.get(`${API}/news?category=${name}`)
    setData(response.data.news)
  }

  const handleDelete = async (id) => {
    toast.success('pending data')
    await axios.delete(`${API}/news`, {
      data: { id }
    })
    setTimeout(() => {
      getData()
      toast.success('fetch success')
    }, 2000);
  }

  return (
      <div className="w-screen py-[100px] flex flex-col items-center justify-center bg-gradient-to-br from-[#6D90B9] to-[#BBC7DC]">
        <Toaster />
      <div className='flex items-center gap-x-4'>
      <form className="w-[800px] bg-white p-8 flex flex-col gap-4 mb-10" onSubmit={handleSubmit}>
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="title" placeholder="Title" />
        {/* <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="description" placeholder="Description" /> */}
        <textarea required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]"  name="description"></textarea>
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="sourceTitle" placeholder="sourceTitle" />
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="sourceLink" placeholder="sourceLink" />
        <input required onChange={selectImage} type="file" name="image" />
        <select className='bg-black text-white' name="category" id="">
          {categories?.map((elem) => {
            return (
              <option key={elem._id} value={elem._id}>{elem.name}</option>
            )
          })}
        </select>
        <button className="w-full bg-blue-500 text-white py-2">SUBMIT</button>
      </form>
      <form className="w-[400px] bg-white p-8 flex flex-col gap-4 mb-10" onSubmit={handleSubmitCategory}>
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="category" placeholder="Category name" />
        <button className="w-full bg-blue-500 text-white py-2">SUBMIT</button>
        </form>
      </div>
      <div className='flex'>
          <button onClick={() => getByCategory(0)} className='bg-green-300 m-2 px-4'>All</button>
          {categories?.map((elem, key) => {
            return (
              <button key={key} onClick={() => getByCategory(elem.name)} className='bg-green-300 m-2 px-4'>{elem.name}</button>
            )
          })}
        </div>
     <div className="container">
     <div className='grid grid-cols-5 gap-4 mx-auto'>
     {data?.map((elem) => {
        return (
          <div key={elem._id} 
            className="h-[400px] w-[300px] mx-auto overflow-y-scroll bg-white p-4 flex flex-col gap-4">
              <div className='flex items-center gap-x-2'>
              <button onClick={() => handleView(elem._id)} className='text-white px-2 py-1 bg-red-300'>VIEW</button>
              <button onClick={() => handleDelete(elem._id)} className='text-white px-2 py-1 bg-blue-300'>DELETE</button>
              </div>
            <img src={`http://repo.gozle.com.tm/eportalback/${elem.image}`} className="w-full" alt="" />
            <h2>View {elem.view}</h2>
            <h2>Created at: {elem.created_at}</h2>
            <h2>Read minute: {elem.read_time}</h2>
            <h1 className='font-bold'>{elem.title}</h1>
            <h1 className='font-bold'>Category: {elem.category_name}</h1>
            <p>{elem.description}</p>
            <a href={elem.source_link} className='text-[40px] text-red-300'>{elem.source_title}</a>
          </div>
        )
      })}
     </div>
     </div>
    </div>
  )
}

export default App
