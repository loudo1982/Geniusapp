"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/initFirebase"; // ajusta si tu init está en otra ruta

// contraseña clara (tal como pediste)
const GLOBAL_PASSWORD = "Erickalamejor";
// clave para sessionStorage
const SKEY = "edit_global_pass_ok";

export default function EditarTallerPage({ params }) {
  const router = useRouter();
  const tallerId = params?.id;

  const [authorized, setAuthorized] = useState(false);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(true);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [taller, setTaller] = useState(null);
  const [error, setError] = useState(null);

  const storageKey = useMemo(() => SKEY, []);

  // revisar sesión (si ya tiene pase)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ok = sessionStorage.getItem(storageKey);
      if (ok === "1") setAuthorized(true);
      setChecking(false);
    }
  }, [storageKey]);

  // cargar documento SOLO si está autorizado
  useEffect(() => {
    if (!authorized || !tallerId) return;
    (async () => {
      setLoadingDoc(true);
      try {
        const snap = await getDoc(doc(db, "products", String(tallerId)));
        if (!snap.exists()) {
          setError("El taller no existe.");
        } else {
          setTaller({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        setError(e?.message || "Error cargando el taller.");
      } finally {
        setLoadingDoc(false);
      }
    })();
  }, [authorized, tallerId]);

  // validar la contraseña en claro
  function handleCheckCode(e) {
    e.preventDefault();
    setError(null);
    if (code.trim() === GLOBAL_PASSWORD) {
      setAuthorized(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(storageKey, "1");
      }
    } else {
      setError("Contraseña incorrecta.");
    }
  }

  // guardar cambios
  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      nombre: form.get("nombre")?.toString() || "",
      descripcion: form.get("descripcion")?.toString() || "",
      requisito: form.get("requisito")?.toString() || "",
      cupoMaximo: Number(form.get("cupoMaximo") || 0),
    };
    try {
      await updateDoc(doc(db, "products", String(tallerId)), payload);
      router.push("/taller2"); // vuelve al listado; cambia si tu ruta es diferente
    } catch (err) {
      setError(err?.message || "No se pudo guardar.");
    }
  }

  if (checking) return <p className="p-4">Verificando…</p>;

  if (!authorized) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Edición protegida</h1>
        <p className="text-sm text-gray-600 mb-4">Ingresa la contraseña para editar talleres.</p>
        {error && <p className="mb-3 text-red-600 text-sm">{error}</p>}
        <form onSubmit={handleCheckCode} className="space-y-3">
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            placeholder="Contraseña"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
            >
              Verificar
            </button>
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                // opción para mostrar pista si quieres; aquí la mostramos
                alert("Pista: pregunta a Erickalamejor 😄");
              }}
            >
              Mostrar pista
            </button>
          </div>
        </form>
      </div>
    );
  }

  // autorizado: muestra y edita
  if (loadingDoc) return <p className="p-4">Cargando taller…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!taller) return <p className="p-4">No encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Editando: {taller.nombre}</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input name="nombre" defaultValue={taller.nombre} className="w-full rounded border px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea name="descripcion" defaultValue={taller.descripcion} rows={5} className="w-full rounded border px-3 py-2" required />
        </div>

        <div>
          <label className="block text-sm mb-1">Requisito</label>
          <textarea name="requisito" defaultValue={taller.requisito} rows={4} className="w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Cupo máximo</label>
          <input type="number" name="cupoMaximo" defaultValue={taller.cupoMaximo ?? 0} className="w-full rounded border px-3 py-2" min={0} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="rounded border px-4 py-2">Cancelar</button>
          <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Guardar cambios</button>
        </div>
      </form>
    </div>
  );
}
