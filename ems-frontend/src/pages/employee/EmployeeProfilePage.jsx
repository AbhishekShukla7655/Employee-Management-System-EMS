import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { employeeService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatDate, calculateAge } from "../../utils/helpers";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Avatar from "../../components/common/Avatar";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function EmployeeProfilePage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: () => employeeService.getProfile().then((r) => r.data),
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({ values: profile });

  const updateMutation = useMutation({
    mutationFn: employeeService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["employee-profile"]);
      setEditMode(false);
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    setUploading(true);
    try {
      const res = await employeeService.uploadImage(
        profile?.id || user?.id,
        fd,
      );
      const newImageUrl = res.data?.profileImageUrl;
      queryClient.invalidateQueries(["employee-profile"]);
      if (newImageUrl) {
        updateUser({ ...user, profileImageUrl: newImageUrl });
      }
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  const p = profile || user || {};

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <Avatar
              name={`${p.firstName} ${p.lastName}`}
              src={p.profileImageUrl}
              size="2xl"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center shadow-lg transition-colors"
            >
              <Camera size={14} className="text-white" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {p.firstName} {p.lastName}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {p.designation} • {p.department}
                </p>
              </div>
              <Button
                variant={editMode ? "secondary" : "primary"}
                size="sm"
                onClick={() => setEditMode((e) => !e)}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Mail, value: p.email },
                { icon: Phone, value: p.phoneNumber },
                { icon: MapPin, value: p.address },
                {
                  icon: Briefcase,
                  value: p.experience ? `${p.experience} yrs exp` : null,
                },
                { icon: GraduationCap, value: p.education },
              ]
                .filter((i) => i.value)
                .map(({ icon: Icon, value }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
                  >
                    <Icon size={13} className="flex-shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info grid or edit form */}
      {!editMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-5">
            <p className="font-semibold text-[var(--text-primary)] text-sm mb-4">
              Personal Details
            </p>
            <div className="space-y-3">
              {[
                ["Gender", p.gender],
                ["Age", p.age],
                ["Date of Birth", formatDate(p.dateOfBirth)],
                ["Joining Date", formatDate(p.joiningDate)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <span className="text-xs text-[var(--text-secondary)]">
                    {k}
                  </span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {v || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <p className="font-semibold text-[var(--text-primary)] text-sm mb-4">
              Professional Details
            </p>
            <div className="space-y-3">
              {[
                ["Department", p.department],
                ["Designation", p.designation],
                ["Education", p.education],
                ["Experience", p.experience ? `${p.experience} years` : null],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <span className="text-xs text-[var(--text-secondary)]">
                    {k}
                  </span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {v || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">
            Edit Information
          </h3>
          <form
            onSubmit={handleSubmit((d) =>
              updateMutation.mutate({
                ...d,
                age: calculateAge(d.dateOfBirth),
              }),
            )}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                {...register("firstName", { required: "Required" })}
              />
              <Input
                label="Last Name"
                {...register("lastName", { required: "Required" })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Phone" {...register("phoneNumber")} />
              <div className="w-full">
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register("dateOfBirth")}
                />
                {watch("dateOfBirth") && (
                  <p className="text-xs mt-1 text-blue-400">
                    Age: {calculateAge(watch("dateOfBirth"))} years
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
                {...register("gender")}
              />
              <Input label="Education" {...register("education")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Experience (years)"
                type="number"
                placeholder="e.g. 3"
                {...register("experience", {
                  min: { value: 0, message: "Min 0" },
                })}
              />
              <div className="w-full">
                <label className="label">Age</label>
                <div className="input flex items-center opacity-60 cursor-not-allowed">
                  {watch("dateOfBirth")
                    ? calculateAge(watch("dateOfBirth"))
                    : p.age || "—"}{" "}
                  years
                </div>
                <p className="text-xs mt-1 text-[var(--text-secondary)]">
                  Auto-calculated from DOB
                </p>
              </div>
            </div>

            <Input label="Address" {...register("address")} />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftIcon={Save}
                loading={updateMutation.isPending || isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
