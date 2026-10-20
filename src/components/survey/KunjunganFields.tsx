import { NAMA_MAX } from "@/lib/survey/constants";
import DatePicker from "./DatePicker";
import LayananSelect from "./LayananSelect";
import SurveyCard from "./SurveyCard";
import { SurveyField, SurveyTextInput } from "./SurveyField";

export default function KunjunganFields({
  formId,
  nama,
  tanggal,
  layanan,
  layananError,
  onNamaChange,
  onTanggalChange,
  onLayananChange,
}: {
  formId: string;
  nama: string;
  tanggal: string;
  layanan: string;
  layananError?: string;
  onNamaChange: (value: string) => void;
  onTanggalChange: (value: string) => void;
  onLayananChange: (value: string) => void;
}) {
  const layananErrorId = `${formId}-layanan-error`;
  const namaId = `${formId}-nama`;
  const tanggalId = `${formId}-tanggal`;

  return (
    <SurveyCard>
      <h2 className="font-body text-heading text-xl font-semibold">Kunjungan</h2>
      <p className="font-body text-heading/70 text-sm">
        Nama dan tanggal boleh dikosongkan. Layanan wajib dipilih.
      </p>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <SurveyField label="Nama" htmlFor={namaId}>
          <SurveyTextInput
            id={namaId}
            type="text"
            name="nama"
            autoComplete="name"
            placeholder="Boleh dikosongkan"
            maxLength={NAMA_MAX}
            value={nama}
            onChange={(event) => onNamaChange(event.target.value.slice(0, NAMA_MAX))}
          />
        </SurveyField>
        <SurveyField label="Tanggal kunjungan" htmlFor={tanggalId}>
          <DatePicker id={tanggalId} name="tanggal" value={tanggal} onChange={onTanggalChange} />
        </SurveyField>
        <SurveyField
          label="Layanan"
          htmlFor={`${formId}-layanan`}
          className="sm:col-span-2"
          error={layananError}
          errorId={layananError ? layananErrorId : undefined}
        >
          <LayananSelect
            id={`${formId}-layanan`}
            name="layanan"
            value={layanan}
            onChange={onLayananChange}
            invalid={Boolean(layananError)}
            describedBy={layananError ? layananErrorId : undefined}
          />
        </SurveyField>
      </div>
    </SurveyCard>
  );
}
