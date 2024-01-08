import React from 'react';

export default function ItemDetails({ selectedItemDetails, setDetailsVisible }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setDetailsVisible(false)}>
          &times;
        </span>
        <h2>Details</h2>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Nama Barang</td>
              <td>{selectedItemDetails?.nama_barang}</td>
            </tr>
            <tr>
              <td>Jumlah</td>
              <td>{selectedItemDetails?.jumlah}</td>
            </tr>
            <tr>
              <td>Harga Satuan</td>
              <td>{selectedItemDetails?.harga_satuan}</td>
            </tr>
            <tr>
              <td>Lokasi</td>
              <td>{selectedItemDetails?.lokasi}</td>
            </tr>
            <tr>
              <td>Deskripsi</td>
              <td>{selectedItemDetails?.deskripsi}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
