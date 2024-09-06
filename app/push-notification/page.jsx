"use client";

const PushNotification = () => {
  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">การเเจ้งเตือน</h1>

      <div className="flex justify-end mb-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Create new push notification</button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date Added</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Testing</td>
              <td className="border px-4 py-2">Enter Push Notification to be sent to all users</td>
              <td className="border px-4 py-2 text-center">Sent</td>
              <td className="border px-4 py-2 text-center">27/01/2020</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-blue-500 text-white px-2 py-1 rounded-lg">Send</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PushNotification;