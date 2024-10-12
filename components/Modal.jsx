import React from 'react';

const Modal = ({ isOpen, onClose, post, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    description: '',
    picture: '',
    link_other: '',
    username: '',
    isRecruiting: false,
    maxParticipants: '',
    member: 'no', // Initialize member as 'no' by default
  });

  React.useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        isRecruiting: post.member === 'yes', // Set isRecruiting based on member
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          picture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevState) => {
      const isRecruiting = !prevState.isRecruiting;
      return {
        ...prevState,
        isRecruiting,
        member: isRecruiting ? 'yes' : 'no', // Update member field based on recruiting state
        maxParticipants: isRecruiting ? prevState.maxParticipants : '', // Reset maxParticipants if closing registration
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new form data object to avoid modifying original formData directly
    const { isRecruiting, ...rest } = formData; // Destructure to remove isRecruiting
    onSave({
      ...rest,
      member: isRecruiting ? 'yes' : 'no', // Set member based on recruiting state
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto mt-10">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex justify-between">
            <div className="w-1/2 pr-2">
              <label className="block mb-1">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border rounded w-full p-2 bg-slate-200"
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
            <label className="block mb-1">รูปภาพ (Upload)</label>
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              className="border rounded w-full p-2"
              accept="image/*"
            />
            {formData.picture && (
              <img src={formData.picture} alt="Preview" className="mt-2 max-w-80 h-auto" />
            )}
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
          {/* Member Registration Section */}
          <div className="mb-4">
            <label className="block mb-1">
              เปิดรับสมัครสมาชิก
              <input
                type="checkbox"
                name="isRecruiting"
                checked={formData.isRecruiting}
                onChange={handleCheckboxChange} // Use the new handler here
                className="ml-2"
              />
            </label>
            {formData.isRecruiting && (
              <div className="mt-2">
                <label className="block mb-1">จำนวนผู้เข้าร่วมสูงสุด</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required={formData.isRecruiting} // Required only if recruiting
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
