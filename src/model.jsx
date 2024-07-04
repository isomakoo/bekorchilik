import { Button, Modal, message } from "antd";
import { useEffect, useState } from "react";
import "./model.css";

function Model() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [brands, setBrands] = useState([]);

  const accessToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxOTY2MTE1NCwiZXhwIjoxNzUxMTk3MTU0fQ.GOoRompLOhNJyChMNC1sstK9_BbZAfff0GZ9ox4pZb4";

  useEffect(() => {
    getList();
    getBrands();
  }, []);

  const getList = async () => {
    try {
      const response = await fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models");
      const data = await response.json();
      setList(data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const getBrands = async () => {
    try {
      const response = await fetch("https://autoapi.dezinfeksiyatashkent.uz/api/brands");
      const data = await response.json();
      setBrands(data?.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const showModal = (id) => {
    setModalOpen(true);
    setSelectedId(id);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await deleteItem(selectedId);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/models/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        message.success("Muvaffaqiyatli o'chirildi");
        getList();
        handleCancel();
      } else {
        message.error("Nimadir xato bo'ldi");
        console.error("Kategoriyani o'chirishda xato:", result);
      }
    } catch (error) {
      console.error("Ma'lumotlarni o'chirishda xato:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleAddModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsModalOpen(false);
    setNameEn("");
    setNameRu("");
  };

  const addCategory = async () => {
    const formData = new FormData();
    formData.append("name", nameEn);
    formData.append("brand_title", nameRu);

    try {
      const response = await fetch("https://autoapi.dezinfeksiyatashkent.uz/api/models", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        message.success("Category added successfully");
        getList();
        handleAddModalClose();
      } else {
        message.error("Something went wrong");
        console.error("Error adding category:", result);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", nameEn);
    formData.append("brand_title", nameRu);
    try {
      const response = await fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/models/${selectedId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        message.success("Kategoriya muvaffaqiyatli tahrirlandi");
        getList();
        handleAddModalClose();
      } else {
        message.error("Kategoriya tahrirlanmadi");
        console.error("Kategoriyani tahrirlashda xato:", result);
      }
    } catch (error) {
      message.error("Ma'lumotlarni tahrirlashda xato");
      console.error("Ma'lumotlarni tahrirlashda xato:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="model-container">
      <div className="model-list">
        <Button type="primary" onClick={handleAddModalOpen}>
          Qushish
        </Button>
        <Modal
          title="Kategoriya qo'shishni xohlaysizmi?"
          open={isModalOpen}
          onOk={addCategory}
          onCancel={handleAddModalClose}
        >
          <form>
            <input
              type="text"
              required
              placeholder="Name"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
            <br />
            <select onChange={(e) => setNameRu(e.target.value)}>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.title}>
                  {brand.title}
                </option>
              ))}
            </select>
            <br />
          </form>
        </Modal>
        <table id="customers">
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Brand Title</th>
              <th>O'zgartirishlar</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            ) : (
              list.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.brand_title}</td>
                  <td>
                    <Button type="primary" onClick={() => showModal(item.id)}>
                      Tahrirlash
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => showModal(item.id)}
                    >
                      O'chirish
                    </Button>
                    <Modal
                      title="Kategoriyani o'chirish"
                      open={modalOpen}
                      onOk={handleOk}
                      confirmLoading={confirmLoading}
                      onCancel={handleCancel}
                    >
                      <p>Kategoriyani o'chirishni xohlaysizmi?</p>
                    </Modal>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Model;
