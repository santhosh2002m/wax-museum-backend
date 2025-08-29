import React, { useState, useEffect } from "react";
import {
  Calendar,
  Send,
  Users,
  MessageSquare,
  Search,
  Eye,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function CrmDashboard() {
  const [activeTab, setActiveTab] = useState("send");
  const [singlePhone, setSinglePhone] = useState("");
  const [singleMessage, setSingleMessage] = useState("");
  const [bulkPhones, setBulkPhones] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  // Add state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const { sendMessage, sendBulkMessages, fetchSentMessages, messages } =
    useData();

  const [stats, setStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    totalAmount: 0,
    todayMessages: 0,
  });

  useEffect(() => {
    if (messages.length > 0) {
      const totalSent = messages.filter((msg) => msg.status === "sent").length;
      const totalFailed = messages.filter(
        (msg) => msg.status === "failed"
      ).length;

      setStats({
        totalSent,
        totalFailed,
        totalAmount: totalSent * 0.1,
        todayMessages: messages.filter((msg) => {
          const msgDate = new Date(msg.createdAt).toDateString();
          const today = new Date().toDateString();
          return msgDate === today;
        }).length,
      });
    }
  }, [messages]);

  const formatPhone = (phone: string) => {
    let trimmed = phone.trim();
    if (!trimmed.startsWith("+")) {
      trimmed = `+91${trimmed}`;
    }
    return trimmed;
  };

  const handleSingleSend = async () => {
    if (!singlePhone || !singleMessage) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const phone = formatPhone(singlePhone);
      const success = await sendMessage(phone, singleMessage);

      if (success) {
        setSinglePhone("");
        setSingleMessage("");
      }
    } catch (error) {
      alert("Failed to send message");
    }
    setLoading(false);
  };

  const handleBulkSend = async () => {
    if (!bulkPhones || !bulkMessage) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const phoneList = bulkPhones
        .split("\n")
        .map((phone) => formatPhone(phone))
        .filter((phone) => phone.match(/^\+\d{10,15}$/));

      if (phoneList.length === 0) {
        alert("Please enter valid phone numbers");
        setLoading(false);
        return;
      }

      const success = await sendBulkMessages(phoneList, bulkMessage);

      if (success) {
        setBulkPhones("");
        setBulkMessage("");
      }
    } catch (error) {
      alert("Failed to send bulk messages");
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setTableLoading(true);
    setCurrentPage(1); // Reset to first page on new search
    try {
      await fetchSentMessages(
        startDate,
        endDate,
        statusFilter !== "all" ? statusFilter : undefined
      );
    } catch (error) {
      alert("Failed to fetch messages");
    }
    setTableLoading(false);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setCurrentPage(1); // Reset to first page on clear
    setTableLoading(true);
    fetchSentMessages("", "", undefined)
      .then(() => setTableLoading(false))
      .catch(() => setTableLoading(false));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage WhatsApp communications</p>
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            Admin Profile
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="px-6 flex space-x-8">
          <button
            onClick={() => setActiveTab("send")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "send"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Send Messages
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "history"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Message History
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Send Messages */}
        {activeTab === "send" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Single */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Send Single Message
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  placeholder="Phone number (auto +91 if missing)"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={singleMessage}
                  onChange={(e) => setSingleMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter your message..."
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSingleSend}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>

            {/* Bulk */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Send Bulk Messages
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <textarea
                  value={bulkPhones}
                  onChange={(e) => setBulkPhones(e.target.value)}
                  rows={4}
                  placeholder="One phone per line (auto +91 if missing)"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter your bulk message..."
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleBulkSend}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded-md flex justify-center"
                >
                  {loading ? "Sending..." : "Send Bulk Messages"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Filter Messages
              </h3>
              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={tableLoading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md flex justify-center"
                  >
                    {tableLoading ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3 bg-gray-200 text-gray-700 py-2 rounded-md"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Total Sent</div>
                <div className="text-2xl font-bold">{stats.totalSent}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Total Failed</div>
                <div className="text-2xl font-bold">{stats.totalFailed}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-2xl font-bold">
                  ${stats.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Today's Messages</div>
                <div className="text-2xl font-bold">{stats.todayMessages}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Message History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentMessages.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          {tableLoading
                            ? "Loading..."
                            : "No messages found. Please select a date range and search."}
                        </td>
                      </tr>
                    ) : (
                      currentMessages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {msg.phone}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {msg.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                msg.status === "sent"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {msg.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(msg.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
