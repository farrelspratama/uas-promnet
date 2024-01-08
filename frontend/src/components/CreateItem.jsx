import { useState } from 'react';
import InventoryService from '../service/UserService';

export default function CreateItem() {
  const [item, setItem] = useState({
    namaBarang: '',
    jumlah: 1,
    hargaSatuan: 0,
    lokasi: 'Bandung',
    deskripsi: '',
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await InventoryService.createInventoryItem({
        nama_barang: item.namaBarang,
        jumlah: parseInt(item.jumlah), // Konversi ke integer
        harga_satuan: parseFloat(item.hargaSatuan), // Konversi ke float
        lokasi: item.lokasi,
        deskripsi: item.deskripsi,
      });

      if (response.status === 201) {
        // Data berhasil ditambahkan ke backend
        console.log('Data item berhasil ditambahkan:', item);

        // Alert
        alert('Barang berhasil ditambahkan!');

        //Refresh
        window.location.reload();
      } else {
        // Handle kesalahan jika diperlukan
        console.error('Gagal menambahkan data item ke backend');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='create-item-form'>
      <h2>Form Inventaris Barang</h2>
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

        <button type="submit">Tambah Barang</button>
      </form>
    </div>
  );
}
