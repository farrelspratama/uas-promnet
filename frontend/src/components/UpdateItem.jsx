import { useState, useEffect } from 'react';
import InventoryService from '../service/UserService';

export default function UpdateItem({ itemId }) {
  const [item, setItem] = useState({
    namaBarang: '',
    jumlah: 1,
    hargaSatuan: 0,
    lokasi: 'Bandung',
    deskripsi: '',
  });

  useEffect(() => {
    // Fetch the existing item data based on itemId and set it to the state
    const fetchItemData = async () => {
      try {
        const response = await InventoryService.getInventoryItemById(itemId);

        if (response.status === 200) {
          const existingItem = response.data;
          setItem({
            namaBarang: existingItem.nama_barang,
            jumlah: existingItem.jumlah,
            hargaSatuan: existingItem.harga_satuan,
            lokasi: existingItem.lokasi,
            deskripsi: existingItem.deskripsi,
          });
        } else {
          console.error('Gagal mendapatkan data item dari backend');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchItemData();
  }, [itemId]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await InventoryService.updateInventoryItem({
        nama_barang: item.namaBarang,
        jumlah: parseInt(item.jumlah), // Convert to integer
        harga_satuan: parseFloat(item.hargaSatuan), // Convert to float
        lokasi: item.lokasi,
        deskripsi: item.deskripsi,
      }, itemId);

      if (response.status === 200) {
        console.log('Data item berhasil diperbarui:', item);
      } else {
        console.error('Gagal memperbarui data item ke backend');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='update-item-form'>
      <h2>Form Perbarui Inventaris Barang</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="namaBarang">Nama Barang:</label>
        <input
          type="text"
          id="namaBarang"
          name="namaBarang"
          value={item.namaBarang}
          onChange={handleChange}
          required
        />

        <label htmlFor="jumlah">Jumlah:</label>
        <div className='number-input-group'>
          <input
            type="number"
            id="jumlah"
            name="jumlah"
            value={item.jumlah}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <label htmlFor="hargaSatuan">Harga Satuan:</label>
        <input
          type="number"
          id="hargaSatuan"
          name="hargaSatuan"
          value={item.hargaSatuan}
          onChange={handleChange}
          min="0"
          required
        />

        <label htmlFor="lokasi">Lokasi:</label>
        <select
          id="lokasi"
          name="lokasi"
          value={item.lokasi}
          onChange={handleChange}
        >
          <option value="Bandung">Bandung</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Denpasar">Denpasar</option>
          <option value="Manokwari">Manokwari</option>
        </select>

        <label htmlFor="deskripsi">Deskripsi:</label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          value={item.deskripsi}
          onChange={handleChange}
          rows="1"
        ></textarea>

        <button type="submit">Perbarui Barang</button>
      </form>
    </div>
  );
}
