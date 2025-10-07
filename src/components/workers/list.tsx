"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfessionMultiSelect from "../shared/profession-multi-select";
import PrimaryProfessionSelect from "../shared/primary-profession-select";

interface Profession {
  id: number;
  name: string;
}

interface Worker {
  id: string;
  user?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    gender?: string;
    street_address?: string;
    digital_address?: string;
    email?: string;
    date_of_birth?: string;
    town?: { name: string };
    photo?: string;
    date_joined?: string;
    last_login?: string;
    referred_by?: string;
    is_active?: boolean;
  };
  primary_profession?: {
    name: string;
  };
  is_available?: boolean;
  profesion_categories?: { id: string; name: string }[];
  bio?: string;
  rating?: number;
  completed_jobs?: number;
  is_online?: boolean;
  momo_account_number?: string;
  momo_account_name?: string;
  verified_worker?: boolean;
  premium_service?: boolean;
  is_agency?: boolean;
}

export default function WorkersDashboard() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const [newWorker, setNewWorker] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    identification_card: "ghana_card",
    primary_profession: "",
    digital_address: "",
    street_address: "",
    gender: "",
    profesion_categories: [] as string[],
    photo: null as File | null,
    business_certificate: null as File | null,
    id_card_front: null as File | null,
    id_card_back: null as File | null,
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  // --- Helpers ---
  const isImage = (file: File | null): boolean => {
    return file !== null && file.type !== undefined && file.type.startsWith("image/");
  };

  const compressImage = async (file: File, maxSizeKB = 500): Promise<File> => {
    if (!file || !isImage(file) || file.size <= maxSizeKB * 1024) return file;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file for compression"));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = document.createElement('img');
      image.onerror = () => reject(new Error("Failed to load image for compression"));
      image.onload = () => resolve(image);
      image.src = dataUrl;
    });

    const maxDimension = 1024;
    const { width: originalWidth, height: originalHeight } = img;
    let width = originalWidth;
    let height = originalHeight;
    
    if (width > height) {
      if (width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      }
    } else {
      if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.drawImage(img, 0, 0, width, height);

    const canvasToBlob = (quality: number): Promise<Blob | null> =>
      new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      });

    const qualityLevels = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
    for (const q of qualityLevels) {
      const blob = await canvasToBlob(q);
      if (!blob) continue;
      if (blob.size <= maxSizeKB * 1024) {
        return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      }
    }

    const lastBlob = await canvasToBlob(0.4);
    return new File([lastBlob as Blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  // --- Fetch professions ---
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const res = await fetch("https://api.olapy.app/api/v1/accounts/professions/");
        if (!res.ok) throw new Error(`Failed to fetch professions: ${res.status}`);
        const json = await res.json();
        const p = json.data ?? json.results ?? json;
        setProfessions(Array.isArray(p) ? p : []);
      } catch (err) {
        console.error(err);
        setError("Could not load professions.");
      }
    };
    fetchProfessions();
  }, []);

  // --- Fetch workers ---
  useEffect(() => {
    const fetchWorkers = async () => {
      setIsFetching(true);
      setError("");
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Authentication token not found.");
        const res = await fetch("https://api.olapy.app/api/v1/webapp/worker-profile/staff-access", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        const w = json.results ?? json.data ?? json;
        setWorkers(Array.isArray(w) ? w : []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to fetch workers.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchWorkers();
  }, [success]);

  // --- Input handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewWorker((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = String(e.target.value);
    const checked = e.target.checked;
    setNewWorker((prev) => ({
      ...prev,
      profesion_categories: checked
        ? [...prev.profesion_categories.filter((x) => x !== id), id]
        : prev.profesion_categories.filter((cat) => cat !== id),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] ?? null;
    setNewWorker((prev) => ({ ...prev, [field]: file }));
  };

  // --- Add worker ---
  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication token not found.");

      const formData = new FormData();
      formData.append("first_name", newWorker.first_name);
      formData.append("last_name", newWorker.last_name);
      formData.append("phone_number", newWorker.phone_number);
      formData.append("identification_card", newWorker.identification_card);
      formData.append("primary_profession", newWorker.primary_profession);
      formData.append("digital_address", newWorker.digital_address);
      formData.append("street_address", newWorker.street_address);
      formData.append("gender", newWorker.gender);

      newWorker.profesion_categories.forEach((category) => {
        formData.append("profesion_categories", category);
      });

      if (newWorker.photo) {
        const photoFile = isImage(newWorker.photo) ? await compressImage(newWorker.photo) : newWorker.photo;
        formData.append("photo", photoFile);
      }

      if (newWorker.business_certificate) {
        formData.append("business_certificate", newWorker.business_certificate);
      }

      if (newWorker.id_card_front) {
        const idFront = isImage(newWorker.id_card_front) ? await compressImage(newWorker.id_card_front) : newWorker.id_card_front;
        formData.append("id_card_front", idFront);
      }

      if (newWorker.id_card_back) {
        const idBack = isImage(newWorker.id_card_back) ? await compressImage(newWorker.id_card_back) : newWorker.id_card_back;
        formData.append("id_card_back", idBack);
      }

      const res = await fetch("https://api.olapy.app/api/v1/webapp/worker-profile/staff-access", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Create worker error:", errData);
        throw new Error(errData.message || `HTTP error! status: ${res.status}`);
      }

      const created = await res.json();

      const userFromCreated = created.user ?? null;
      const builtUser = userFromCreated
        ? {
            first_name: userFromCreated.first_name ?? newWorker.first_name,
            last_name: userFromCreated.last_name ?? newWorker.last_name,
            phone_number: userFromCreated.phone_number ?? newWorker.phone_number,
            gender: userFromCreated.gender ?? newWorker.gender,
            street_address: userFromCreated.street_address ?? newWorker.street_address,
            digital_address: userFromCreated.digital_address ?? newWorker.digital_address,
          }
        : {
            first_name: created.first_name ?? newWorker.first_name,
            last_name: created.last_name ?? newWorker.last_name,
            phone_number: created.phone_number ?? newWorker.phone_number,
            gender: created.gender ?? newWorker.gender,
            street_address: created.street_address ?? newWorker.street_address,
            digital_address: created.digital_address ?? newWorker.digital_address,
          };

      const primaryProfessionObj =
        (created.primary_profession && typeof created.primary_profession === "object" && created.primary_profession.name)
          ? { name: created.primary_profession.name }
          : professions.find((p) => String(p.id) === String(newWorker.primary_profession)) ?? { name: "N/A" };

      const transformedWorker: Worker = {
        id: created.id ?? Date.now().toString(),
        user: builtUser,
        primary_profession: primaryProfessionObj,
        is_available: created.is_available ?? true,
      };

      setWorkers((prev) => [...prev, transformedWorker]);
      setSuccess("Worker added successfully");
      setShowAddWorkerModal(false);

      setNewWorker({
        first_name: "",
        last_name: "",
        phone_number: "",
        identification_card: "ghana_card",
        primary_profession: "",
        digital_address: "",
        street_address: "",
        gender: "",
        profesion_categories: [],
        photo: null,
        business_certificate: null,
        id_card_front: null,
        id_card_back: null,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to add worker");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Filter + search ---
  const filteredWorkers = workers.filter((w) => {
    const name = `${w.user?.first_name ?? ""} ${w.user?.last_name ?? ""}`.toLowerCase();
    const phone = (w.user?.phone_number ?? "").toLowerCase();
    const profession = (w.primary_profession?.name ?? "").toLowerCase();
    const street = (w.user?.street_address ?? "").toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || name.includes(q) || phone.includes(q) || profession.includes(q) || street.includes(q);
    const status = w.is_available ? "Active" : "Unavailable";
    const matchesFilter = filter === "all" || status === filter;
    return matchesSearch && matchesFilter;
  });

  // --- JSX return (full) ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Workforce Dashboard</h1>
          <button onClick={() => setShowAddWorkerModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Add Worker
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{success}</div>}

        {/* Search + Filter */}
        <div className="bg-white rounded-xl shadow px-6 py-4 mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
            placeholder="Search by name, phone, profession or address..."
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200">
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Full Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Profession</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Street</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isFetching ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading workers...
                  </td>
                </tr>
              ) : filteredWorkers.length > 0 ? (
                filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{`${w.user?.first_name ?? "N/A"} ${w.user?.last_name ?? ""}`}</td>
                    <td className="px-6 py-4">{w.user?.phone_number ?? "N/A"}</td>
                    <td className="px-6 py-4">{w.primary_profession?.name ?? "N/A"}</td>
                    <td className="px-6 py-4">{w.user?.street_address ?? "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${w.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {w.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedWorker(w)} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No workers found.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
        </div>
      </main>

      {/* Add Worker Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold">Add New Worker</h3>
              <button onClick={() => setShowAddWorkerModal(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWorker} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name*</label>
                  <input type="text" name="first_name" value={newWorker.first_name} onChange={handleInputChange} placeholder="First name" required className="w-full p-3 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name*</label>
                  <input type="text" name="last_name" value={newWorker.last_name} onChange={handleInputChange} placeholder="Last name" required className="w-full p-3 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number*</label>
                  <input type="tel" name="phone_number" value={newWorker.phone_number} onChange={handleInputChange} placeholder="Phone number" required className="w-full p-3 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender*</label>
                  <select name="gender" value={newWorker.gender} onChange={handleInputChange} required className="w-full p-3 rounded-lg border">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address*</label>
                  <input type="text" name="street_address" value={newWorker.street_address} onChange={handleInputChange} placeholder="Street address" required className="w-full p-3 rounded-lg border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Digital Address*</label>
                  <input type="text" name="digital_address" value={newWorker.digital_address} onChange={handleInputChange} placeholder="Digital address" required className="w-full p-3 rounded-lg border" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Identification Card Type*</label>
                <select name="identification_card" value={newWorker.identification_card} onChange={handleInputChange} required className="w-full p-3 rounded-lg border">
                  <option value="ghana_card">Ghana Card</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              {/* Profession */}
              <PrimaryProfessionSelect
                professions={professions}
                value={String(newWorker.primary_profession)}
                onChange={(val) =>
                  setNewWorker((prev) => ({ ...prev, primary_profession: val }))
                }
              />

              <ProfessionMultiSelect
                professions={professions}
                selected={newWorker.profesion_categories}
                onChange={(val) =>
                  setNewWorker((prev) => ({ ...prev, profesion_categories: val }))
                }
              />

              {/* Files */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: "photo", label: "Profile Photo*", required: true, accept: "image/*" },
                  { field: "business_certificate", label: "Business Certificate", required: false, accept: ".pdf,.doc,.docx,image/*" },
                  { field: "id_card_front", label: "ID Card Front*", required: true, accept: "image/*" },
                  { field: "id_card_back", label: "ID Card Back*", required: true, accept: "image/*" },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="block text-sm font-medium mb-1">{f.label}</label>
                    <input
                      type="file"
                      accept={f.accept}
                      required={f.required}
                      onChange={(e) => handleFileChange(e, f.field)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {newWorker[f.field as keyof typeof newWorker] && (
                      <p className="text-xs text-gray-500 mt-1">{(newWorker[f.field as keyof typeof newWorker] as File)?.name}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddWorkerModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
                  {isLoading ? "Saving..." : "Save Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Worker Details Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold">Worker Details</h3>
              <button onClick={() => setSelectedWorker(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Personal Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-indigo-700 border-b pb-2">Personal Information</h4>
                
                {selectedWorker.user?.photo && (
                  <div className="flex justify-center">
                    <Image 
                      src={selectedWorker.user.photo} 
                      alt="Profile" 
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="text-gray-900">{selectedWorker.user?.first_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="text-gray-900">{selectedWorker.user?.last_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{selectedWorker.user?.phone_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedWorker.user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-gray-900">{selectedWorker.user?.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-gray-900">{selectedWorker.user?.date_of_birth || "N/A"}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Street Address</p>
                  <p className="text-gray-900">{selectedWorker.user?.street_address || "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Digital Address</p>
                  <p className="text-gray-900">{selectedWorker.user?.digital_address || "N/A"}</p>
                </div>
                
                {selectedWorker.user?.town && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Town</p>
                    <p className="text-gray-900">{selectedWorker.user.town.name || "N/A"}</p>
                  </div>
                )}
              </div>
              
              {/* Right Column - Professional Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-indigo-700 border-b pb-2">Professional Information</h4>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Primary Profession</p>
                  <p className="text-gray-900">{selectedWorker.primary_profession?.name || "N/A"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Profession Categories</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedWorker.profesion_categories?.map((category) => (
                      <span key={category.id} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        {category.name}
                      </span>
                    )) || "N/A"}
                  </div>
                </div>
                
                <div>
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="text-gray-900">{selectedWorker.bio || "No bio provided"}</p>
                  </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <p className="text-gray-900 ml-1">{selectedWorker.rating || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                    <p className="text-gray-900">{selectedWorker.completed_jobs || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedWorker.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {selectedWorker.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Online</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedWorker.is_online ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {selectedWorker.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium text-indigo-700 border-b pb-2 mt-6">Payment Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">MOMO Account Number</p>
                    <p className="text-gray-900">{selectedWorker.momo_account_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">MOMO Account Name</p>
                    <p className="text-gray-900">{selectedWorker.momo_account_name || "N/A"}</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium text-indigo-700 border-b pb-2 mt-6">Verification & Features</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Verified Worker</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedWorker.verified_worker ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {selectedWorker.verified_worker ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Premium Service</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedWorker.premium_service ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                      {selectedWorker.premium_service ? "Premium" : "Standard"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agency</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedWorker.is_agency ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                      {selectedWorker.is_agency ? "Agency" : "Individual"}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium text-indigo-700 border-b pb-2 mt-6">Account Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined Date</p>
                    <p className="text-gray-900">{selectedWorker.user?.date_joined ? new Date(selectedWorker.user.date_joined).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="text-gray-900">{selectedWorker.user?.last_login ? new Date(selectedWorker.user.last_login).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Referred By</p>
                    <p className="text-gray-900">{selectedWorker.user?.referred_by || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedWorker.user?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {selectedWorker.user?.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}