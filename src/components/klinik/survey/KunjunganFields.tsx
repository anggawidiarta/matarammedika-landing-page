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

  return (
    <SurveyCard>
      <h2 className="text-xl font-semibold font-body text-heading">Kunjungan</h2>
      <p className="text-sm font-body text-muted">
        Nama dan tanggal boleh dikosongkan. Layanan wajib dipilih.
      </p>
      <div className="grid gap-4 min-w-0 sm:grid-cols-2">
        <SurveyField label="Nama">
          <SurveyTextInput
            type="text"
            name="nama"
            autoComplete="name"
            placeholder="Boleh dikosongkan"
            value={nama}
            onChange={(event) => onNamaChange(event.target.value)}
          />
        </SurveyField>
        <SurveyField label="Tanggal kunjungan">
          <SurveyTextInput
            type="date"
            name="tanggal"
            value={tanggal}
            onChange={(event) => onTanggalChange(event.target.value)}
          />
        </SurveyField>
        <SurveyField
          label="Layanan *"
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
