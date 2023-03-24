import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

//It takes a token and an id, and returns a QR code
export const generateQR = async (req, res) => {
  const { token, id } = req.body;

  const data = `${process.env.FRONTEND_URL}/tempauth/${id}/${token}`;

  try {
    const result = await QRCode.toDataURL(data);
    res.send({ status: 'OK', data: result });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'FAILED', data: { error: error?.message || error } });
  }
};
