import React from 'react';

const Modal = ({ isOpen, onClose, post, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    start_date: '',
    start_time: '',
    end_date: '', // New field for end date
    end_time: '', // New field for end time
    location: '',
    description: '',
    picture: '',
    link_other: '',
    username: '',
  });

  React.useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto mt-10">
     
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block mb-1 ">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border rounded w-full p-2  bg-slate-200"
                disabled
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-1">วันที่เริ่ม</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
          </div>
          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block mb-1">ชื่อกิจกรรม</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-1">เวลาเริ่ม</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
          </div>
          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block mb-1">วันที่จบงาน</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-1">เวลา (จบงาน)</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">สถานที่</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">รูปภาพ (URL)</label>
            <input
              type="text"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Link Form</label>
            <input
              type="text"
              name="link_other"
              value={formData.link_other}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;