import React from 'react'
import axios from "axios"

function App() {
  const [loading, setLoading] = React.useState(false)
  const [image, setImage] = React.useState()
  const [data, setData] = React.useState([])

  const getData = async () => {
    const response = await axios.get(`http://45.146.167.233:4003/news`)
    setData(response.data.news)
  }

  React.useEffect(() => {
      getData()
  }, [])

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    // ------
    
    const title = e.target.title.value
    const description = e.target.description.value
    const sourceLink = e.target.sourceLink.value
    const sourceTitle = e.target.sourceTitle.value

    const formData = new FormData()
    formData.append("image", image)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('sourceTitle', sourceTitle)
    formData.append('sourceLink', sourceLink)

    const data = formData

    await axios.post(`http://45.146.167.233:4003/news`, data, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })
    
    // ------
    setLoading(false)
  }
  const selectImage = (e) => {
    setImage(e.target.files[0])
  }

  const handleView = async (id) => {
    // await axios.post(`http://192.168.100.68:4003/news/updateView/${id}`)
    setInterval(() => {
      getData()
      console.log('hi');
    }, 2000);  
  }

  return (
      <div className="w-screen py-[100px] flex flex-col items-center justify-center bg-gradient-to-br from-[#6D90B9] to-[#BBC7DC]">
      <form className="w-[400px] bg-white p-8 flex flex-col gap-4 mb-10" onSubmit={handleSubmit}>
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="title" placeholder="Title" />
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="description" placeholder="Description" />
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="sourceTitle" placeholder="sourceTitle" />
        <input required className="w-full border-gray-400 border-2 px-3 py-2 outline-[#6D90B9]" type="text" name="sourceLink" placeholder="sourceLink" />
        <input required onChange={selectImage} type="file" name="image" />
        <button className="w-full bg-[#6D90B9] text-white py-2">SUBMIT</button>
      </form>
     <div className="container">
     <div className='flex flex-col gap-y-4 mx-auto'>
     {data?.map((elem) => {
        return (
          <div key={elem._id} onClick={() => handleView(elem._id)} className="h-[400px] w-[300px] mx-auto overflow-y-scroll bg-white p-4 flex flex-col gap-4">
            <img src={`http://45.146.167.233:4003/${elem.image}`} className="w-full" alt="" />
            <h2>View {elem.view}</h2>
            <h2>View {elem.image}</h2>
            <h1 className='font-bold'>{elem.title}</h1>
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
