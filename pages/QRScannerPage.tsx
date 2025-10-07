import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, XCircle, AlertTriangle, Users, List, CameraOff, QrCode, User, GraduationCap, Shield } from 'lucide-react';
import { AttendanceRecord, Student, Staff, GenericUser } from '@/types';
import { useAppDataStore } from '@/store/appDataStore';

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const isStaff = (user: GenericUser): user is Staff => 'category' in user;

const getRole = (user: GenericUser) => {
    if (isStudent(user)) return 'Estudiante';
    if (isStaff(user)) return user.category === 'Docente' ? user.area : user.role;
    return 'N/A';
};

const UserCarnet: React.FC<{ user: GenericUser; time: string }> = ({ user, time }) => {
    const name = isStudent(user) ? user.fullName : user.name;
    const role = getRole(user);
    const dni = isStudent(user) ? user.documentNumber : user.dni;
    const gradeInfo = isStudent(user) ? `${user.grade} "${user.section}"` : null;

    let RoleIcon: React.ElementType;
    if (isStudent(user)) RoleIcon = User;
    else if (isStaff(user) && user.category === 'Docente') RoleIcon = GraduationCap;
    else RoleIcon = Shield;

    return (
        <motion.div 
            layoutId={`carnet-${dni}`}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-500/30 p-5 m-4 rounded-2xl shadow-2xl shadow-emerald-500/10 text-center">
            
            <div className="flex items-center gap-2 justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <CheckCircle size={24}/>
                <p>Asistió Correctamente</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Marcado a las {time}</p>

            <img src={user.avatarUrl} alt={name} className="w-28 h-28 rounded-full mx-auto my-3 border-8 border-slate-100 dark:border-slate-700 shadow-md"/>
            <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-100 capitalize">{name.toLowerCase()}</h3>
            
            <div className="mt-4 space-y-2 text-left">
                <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <RoleIcon size={18} className="text-indigo-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{role}</span>
                </div>
                {gradeInfo && (
                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                         <GraduationCap size={18} className="text-indigo-500" />
                         <span className="font-semibold text-slate-700 dark:text-slate-200">{gradeInfo}</span>
                    </div>
                )}
                 <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <QrCode size={18} className="text-indigo-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">DNI: {dni}</span>
                </div>
            </div>

        </motion.div>
    );
};

const QRScannerPage: React.FC = () => {
  const allUsers = useAppDataStore(state => state.allUsers);
  const ALL_USERS_MAP = useMemo(() => new Map(
    allUsers.map(user => [('studentCode' in user) ? user.documentNumber : user.dni, user])
  ), [allUsers]);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<{ user: GenericUser, time: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);

  const startScan = useCallback(() => {
    if (!selectedDeviceId) return;
    setIsScanning(true);
    setLastScanned(null);
    setError(null);

    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
      if (result) {
        setScanResult(result.getText());
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
        setError('Error al escanear. Intente de nuevo.');
        setIsScanning(false);
      }
    }).catch(err => {
        console.error(err);
        setError('No se pudo acceder a la cámara. Verifique los permisos y que no esté en uso por otra aplicación.');
        setIsScanning(false);
        setIsCameraReady(false);
    });
  }, [selectedDeviceId, codeReader]);
  
  const stopScan = useCallback(() => {
    codeReader.reset();
    setIsScanning(false);
  },[codeReader]);
  
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
            setVideoInputDevices(videoDevices);
            setSelectedDeviceId(videoDevices[0].deviceId);
            setIsCameraReady(true);
        } else {
            setError("No se encontraron cámaras disponibles.");
        }
      })
      .catch(err => {
        setError("Error al enumerar dispositivos. Por favor, permita el acceso a la cámara en la configuración de su navegador.");
        console.error(err);
      });
      
    return () => {
        stopScan();
    };
  }, [stopScan]);

  useEffect(() => {
    if (scanResult) {
      // FIX: Explicitly type `user` as `GenericUser | undefined` to resolve ambiguity.
      const user: GenericUser | undefined = ALL_USERS_MAP.get(scanResult);
      const now = new Date();
      if (user) {
        const id = isStudent(user) ? user.documentNumber : user.dni;
        const name = isStudent(user) ? user.fullName : user.name;
        const alreadyExists = attendanceList.some(record => record.studentId === id);
        if (!alreadyExists) {
          const newRecord: AttendanceRecord = {
            studentId: id,
            studentName: name,
            timestamp: now.toLocaleTimeString('es-PE'),
            status: 'presente',
            synced: navigator.onLine,
          };
          setAttendanceList(prev => [newRecord, ...prev]);
          setLastScanned({ user: user, time: newRecord.timestamp });
          setError(null);
        } else {
          setError(`El usuario ${name} ya fue registrado.`);
          setLastScanned(null);
        }
      } else {
        setError(`Código QR no válido o usuario no encontrado.`);
        setLastScanned(null);
      }
      // Reset after a delay to allow for new scans
      const timer = setTimeout(() => {
          setScanResult(null);
          // Keep carnet on screen, but clear error
          setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanResult, ALL_USERS_MAP, attendanceList]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full max-h-[calc(100vh-140px)]">
        <div className="lg:col-span-2 flex flex-col bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <video id="video" className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}/>
                {!isScanning && (
                    <div className="text-center text-white p-8">
                        {isCameraReady ? (
                             <>
                                <Camera size={64} className="mx-auto mb-4 opacity-50"/>
                                <h2 className="text-2xl font-bold mb-2">Listo para escanear</h2>
                                <p className="text-slate-400 mb-6">Presione "Iniciar Escaneo" para activar la cámara y tomar asistencia.</p>
                                <button onClick={startScan} className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:scale-105">
                                    <Camera size={20} /> Iniciar Escaneo
                                </button>
                             </>
                        ) : (
                             <>
                                <CameraOff size={64} className="mx-auto mb-4 text-rose-400"/>
                                <h2 className="text-2xl font-bold mb-2 text-rose-300">Cámara no disponible</h2>
                                <p className="text-slate-400">{error}</p>
                            </>
                        )}
                       
                    </div>
                )}
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3/4 max-w-sm h-auto aspect-square border-4 border-white/50 rounded-2xl shadow-lg animate-pulse"></div>
                    </div>
                )}
            </div>
             {isScanning && (
                 <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                    <select 
                        onChange={(e) => setSelectedDeviceId(e.target.value)} 
                        className="bg-slate-700 text-white text-sm rounded-lg p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={videoInputDevices.length <= 1}
                    >
                        {videoInputDevices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                        ))}
                    </select>
                    <button onClick={stopScan} className="px-4 py-2 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition">
                        Detener
                    </button>
                </div>
            )}
        </div>
        
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><List size={22}/> Lista de Asistencia</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Turno Mañana - {new Date().toLocaleDateString('es-PE')}</p>
            </div>
            <div className="p-2 flex-grow overflow-y-auto">
                <AnimatePresence>
                {lastScanned && (
                    <UserCarnet user={lastScanned.user} time={lastScanned.time} />
                )}
                 {error && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 m-4 rounded-xl text-center">
                        <XCircle className="mx-auto text-rose-500" size={40}/>
                        <p className="font-bold text-rose-800 dark:text-rose-300 mt-3">Error de Escaneo</p>
                        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
                    </motion.div>
                )}
                </AnimatePresence>
                <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700/50 rounded-t-lg sticky top-0">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200"><Users size={18}/> Registrados ({attendanceList.length})</h3>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-slate-700 p-2">
                    {attendanceList.map(record => (
                        <motion.li 
                            key={record.studentId}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3"
                        >
                            <span className="font-medium text-slate-700 dark:text-slate-200">{record.studentName}</span>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 dark:text-slate-400">{record.timestamp}</span>
                                {record.synced ? 
                                    <span title="Sincronizado">
                                        <CheckCircle size={16} className="text-emerald-500"/>
                                    </span> : 
                                    <span title="Pendiente de Sincronización">
                                        <AlertTriangle size={16} className="text-amber-500"/>
                                    </span>
                                }
                            </div>
                        </motion.li>
                    ))}
                    {attendanceList.length === 0 && !lastScanned && !error && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <p>Esperando escaneos...</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default QRScannerPage;