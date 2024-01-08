import { useState, useEffect } from "react";
import CreateItem from "./CreateItem";
import UpdateItem from "./UpdateItem";
import ItemDetails from "./ItemDetails";
import InventoryService from "../service/UserService";

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [isCreateItemVisible, setCreateItemVisible] = useState(false);
  const [isUpdateItemVisible, setUpdateItemVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  useEffect(() => {
    // Memanggil API untuk mendapatkan daftar barang saat komponen dimuat
    InventoryService.getInventory()
      .then((response) => setInventory(response.data))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  const toggleCreateItemForm = () => {
    setCreateItemVisible(!isCreateItemVisible);
  };

  const toggleUpdateItemForm = (itemId) => {
    setUpdateItemVisible(!isUpdateItemVisible);
    setSelectedItemId(itemId);
  };

  const toggleDetails = (itemId) => {
    const selectedItem = inventory.find((item) => item.id === itemId);
    setSelectedItemDetails(selectedItem);
    setDetailsVisible(!isDetailsVisible);
    console.log('isDetailsVisible:', isDetailsVisible);
  };

  const handleUpdateSuccess = () => {
    // Refresh daftar barang setelah update
    InventoryService.getInventory()
      .then((response) => setInventory(response.data))
      .catch((error) => console.error("Error fetching inventory:", error));

    // Hide the UpdateItem form after successful update
    setUpdateItemVisible(false);
  };

  const handleDelete = async (itemId) => {
    // Menampilkan konfirmasi untuk menghapus
    const shouldDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus barang ini?"
    );

    if (shouldDelete) {
      try {
        const response = await InventoryService.deleteInventoryItem(itemId);

        if (response.status === 200) {
          // Item berhasil dihapus dari backend
          console.log(`Item dengan ID ${itemId} berhasil dihapus`);
          // Refresh daftar barang setelah penghapusan
          InventoryService.getInventory()
            .then((response) => setInventory(response.data))
            .catch((error) =>
              console.error("Error fetching inventory:", error)
            );

          // Refresh window
          window.location.reload();
        } else {
          // Handle kesalahan jika diperlukan
          console.error(`Gagal menghapus item dengan ID ${itemId}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-center">Daftar Barang</h2>
      <div className="row">
        <button className="btn btn-primary" onClick={toggleCreateItemForm}>
          Tambah Barang
        </button>
        {isCreateItemVisible && <CreateItem onClick={toggleCreateItemForm} />}
      </div>
      <br />
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Jumlah</th>
              <th>Harga Satuan</th>
              <th>Lokasi</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {inventory &&
              inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama_barang}</td>
                  <td>{item.jumlah}</td>
                  <td>{item.harga_satuan}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.deskripsi}</td>
                  <td>
                    <button
                      onClick={() => toggleUpdateItemForm(item.id)}
                      className="btn btn-info"
                    >
                      Update
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => toggleDetails(item.id)}
                      className="btn btn-primary"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Render UpdateItem component when isUpdateItemVisible is true */}
      {isUpdateItemVisible && (
        <UpdateItem
          itemId={selectedItemId}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Render Details modal when isDetailsVisible is true */}
      {isDetailsVisible && (
        <ItemDetails
          selectedItemDetails={selectedItemDetails}
          setDetailsVisible={setDetailsVisible}
        />
      )}
    </div>
  );
}
