import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    const file  = Array.isArray(files.file)  ? files.file[0]  : files.file;
    const code  = Array.isArray(fields.code)  ? fields.code[0]  : fields.code;
    const index = Array.isArray(fields.index) ? fields.index[0] : fields.index;

    if (!file || !code) {
      return res.status(400).json({ success: false, error: 'Missing file or property code' });
    }

    try {
      // Clean the code for use as a Cloudinary public_id
      const cleanCode = code.replace(/[^a-zA-Z0-9-_]/g, '-');
      const publicId  = `prithjyo/${cleanCode}/${index}`;

      const result = await cloudinary.uploader.upload(file.filepath, {
        public_id:      publicId,
        overwrite:      true,
        resource_type:  'image',
        transformation: [
          { width: 1200, height: 900, crop: 'limit', quality: 74, fetch_format: 'auto' }
        ]
      });

      res.status(200).json({ success: true, url: result.secure_url });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}
