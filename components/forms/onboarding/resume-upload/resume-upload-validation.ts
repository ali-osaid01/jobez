import * as yup from "yup";

export const resumeUploadSchema = yup.object({
  file: yup
    .mixed<FileList>()
    .required("Resume is required")
    .test("fileRequired", "Resume is required", (value) => {
      return !!value && value.length > 0;
    })
    .test("fileSize", "File size must be less than 10MB", (value) => {
      const file = value?.[0];
      if (!file) return false;
      return file.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Only PDF or DOCX files allowed", (value) => {
      const file = value?.[0];
      if (!file) return false;

      return [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);
    }),
});
