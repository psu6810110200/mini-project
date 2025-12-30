// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { getWeapons, createWeapon, updateWeapon, deleteWeapon } from '../api/weaponApi';
import type { Weapon, WeaponPayload } from '../types';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State สำหรับจัดการ Form
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WeaponPayload>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'light',
    required_license_level: 1,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getWeapons();
      setWeapons(data);
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลอาวุธได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // จัดการ input ในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'required_license_level' ? Number(value) : value,
    }));
  };

  // Submit Form (Create หรือ Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await updateWeapon(currentId, formData);
        toast.success('แก้ไขข้อมูลสำเร็จ');
      } else {
        await createWeapon(formData);
        toast.success('เพิ่มอาวุธสำเร็จ');
      }
      // Reset Form และโหลดข้อมูลใหม่
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันที่จะลบอาวุธชิ้นนี้?')) return;
    try {
      await deleteWeapon(id);
      toast.success('ลบข้อมูลสำเร็จ');
      fetchData();
    } catch (error) {
      toast.error('ลบข้อมูลไม่สำเร็จ');
    }
  };

  const startEdit = (weapon: Weapon) => {
    setIsEditing(true);
    setCurrentId(weapon.id);
    setFormData({
      name: weapon.name,
      description: weapon.description,
      price: Number(weapon.price),
      stock: weapon.stock,
      category: weapon.category,
      required_license_level: weapon.required_license_level,
    });
    // เลื่อนหน้าจอขึ้นไปที่ฟอร์ม
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'light',
      required_license_level: 1,
    });
  };

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h1>Admin Dashboard - จัดการคลังอาวุธ</h1>

      {/* --- Form Section --- */}
      <div className="card" style={{ padding: '20px', marginBottom: '30px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
        <h3>{isEditing ? 'แก้ไขอาวุธ' : 'เพิ่มอาวุธใหม่'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label>ชื่ออาวุธ:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label>รายละเอียด:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field" rows={3} />
          </div>

          <div>
            <label>ราคา ($):</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label>จำนวนในคลัง:</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label>หมวดหมู่:</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input-field">
              <option value="light">Light</option>
              <option value="heavy">Heavy</option>
              <option value="explosive">Explosive</option>
            </select>
          </div>

          <div>
            <label>เลเวลใบอนุญาตที่ต้องใช้:</label>
            <input type="number" name="required_license_level" value={formData.required_license_level} onChange={handleChange} required className="input-field" />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ marginRight: '10px' }}>
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มอาวุธ'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                ยกเลิก
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- Table Section --- */}
      <div className="card" style={{ marginTop: '20px', overflowX: 'auto', color: 'black' }}>
        <h3>รายการอาวุธทั้งหมด ({weapons.length})</h3>
        {loading ? <p>Loading...</p> : (
          <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th>ชื่อ</th>
                <th>ราคา</th>
                <th>Stock</th>
                <th>หมวดหมู่</th>
                <th>License Level</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {weapons.map((w) => (
                <tr key={w.id}>
                  <td>
                    <strong>{w.name}</strong><br/>
                    <small style={{color: '#666'}}>{w.description.substring(0, 50)}...</small>
                  </td>
                  <td>${Number(w.price).toLocaleString()}</td>
                  <td>{w.stock}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      backgroundColor: w.category === 'explosive' ? '#ffcccc' : w.category === 'heavy' ? '#e6ccff' : '#ccffcc' 
                    }}>
                      {w.category.toUpperCase()}
                    </span>
                  </td>
                  <td style={{textAlign: 'center'}}>{w.required_license_level}</td>
                  <td style={{textAlign: 'center'}}>
                    <button onClick={() => startEdit(w)} style={{ marginRight: '5px', cursor: 'pointer' }}>✏️ แก้ไข</button>
                    <button onClick={() => handleDelete(w.id)} style={{ color: 'red', cursor: 'pointer' }}>🗑️ ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;