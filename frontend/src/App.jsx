import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

<link rel='icon' type='image/x-icon' href='/favicon.ico' />;

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [acciones, setAcciones] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/contactos')
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  useEffect(() => {
    fetch('/api/grupos')
      .then((res) => res.json())
      .then((data) => setGrupos(data));
  }, []);

  useEffect(() => {
    fetch('/api/acciones')
      .then((res) => res.json())
      .then((data) => setAcciones(data));
  }, []);

  useEffect(() => {
    fetch('/api/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .then(() => console.log('Logs cargados:', logs))
      .catch(() => setLogs([]));
  }, []);

  return (
    <div>
      <h1>Whatsap MechaZilla Destroyer Vice Presidente JR</h1>
      <h2>Usuarios</h2>
      <p>Selecciona un usuario para ver sus detalles:</p>
      <select id='usuarios'>
        {usuarios &&
          usuarios.map((usuario) => (
            <option key={usuario.tel} value={usuario.tel}>
              {usuario.nombre}
            </option>
          ))}
      </select>

      <h2>Grupos de Actuación</h2>
      <p>Selecciona un grupo para ver sus detalles:</p>
      <select id='grupos'>
        {grupos &&
          grupos.map((grupo) => (
            <option key={grupo.nombre} value={grupo.nombre}>
              {grupo.nombre}
            </option>
          ))}
      </select>

      <h2>Accion</h2>
      <select id='acciones'>
        {acciones &&
          acciones.map((accion) => (
            <option key={accion.modo} value={accion.modo}>
              {accion.modo}
            </option>
          ))}
      </select>
      <h2>Ejecutar Acción</h2>
      <button
        style={{ backgroundColor: 'red', color: 'white' }}
        onClick={() => {
          const usuarioId = document.getElementById('usuarios').value;
          const grupoNombre = document.getElementById('grupos').value;
          const accionNombre = document.getElementById('acciones').value;
          fetch('/api/ejecutar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuarioId,
              grupoNombre,
              accionNombre,
              accion: 'destruir'
            })
          })
            .then((res) => res.json())
            .then((data) => {
              alert('Acción ejecutada: ' + JSON.stringify(data));
            })
            .catch((err) => {
              alert('Error ejecutando acción', err);
            });
        }}
      >
        MUERTEEEEE
      </button>
      <h2></h2>
      <button
        style={{ backgroundColor: 'blue', color: 'white' }}
        onClick={() => {
          const usuarioId = document.getElementById('usuarios').value;
          const grupoNombre = document.getElementById('grupos').value;
          const accionNombre = document.getElementById('acciones').value;
          fetch('/api/detener', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              body: JSON.stringify({
              usuarioId,
              grupoNombre,
              accionNombre,
              accion: 'detener'
            })
            })
          })
            .then((res) => res.json())
            .then((data) => {
              alert('Acción ejecutada: ' + JSON.stringify(data));
            })
            .catch((err) => {
              alert('Error ejecutando acción', err);
            });
        }}
      >
        DETENER
      </button>

      <h2>Listado de lineas</h2>
      <div>
        {logs &&
          logs.map((linea) => (
            <div key={linea.date}>
              {linea.tipo}{' '}
              {linea.qr ? <QRCodeCanvas value={linea.qr} size={256} /> : null}{' '}
              {linea.status} {linea.date}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
