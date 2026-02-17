import { SPORT_FEES, SPORTS } from '../data/mockData';

// Generate invoice for a registration
export const generateInvoice = (registration) => {
  const items = registration.sports.map((sportId) => {
    const sport = SPORTS.find((s) => s.id === sportId);
    const fee = SPORT_FEES[sportId];
    const playerCount = registration.players[sportId]?.length || 0;

    return {
      sportName: sport.name,
      fee: fee,
      players: playerCount,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.fee, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return {
    registrationId: registration.id,
    universityName: registration.universityName,
    date: new Date().toLocaleDateString(),
    items,
    subtotal,
    tax,
    total,
  };
};

// Generate PDF invoice (mock - in real app would use jsPDF or similar)
export const downloadInvoicePDF = (registration) => {
  const invoice = generateInvoice(registration);

  // Create a simple HTML representation for download
  const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${invoice.universityName}</title>
  <style>
    body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #f9fafb; }
    .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #006747; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #006747; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: #6b7280; margin: 5px 0; font-size: 14px; }
    .aku-logo { color: #006747; font-weight: 600; font-size: 12px; margin-top: 10px; }
    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .invoice-details strong { display: block; color: #006747; margin-bottom: 5px; font-size: 14px; }
    .invoice-details p { margin: 3px 0; color: #374151; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #006747; color: white; padding: 12px; text-align: left; font-weight: 600; font-size: 14px; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
    .totals { text-align: right; border-top: 2px solid #e5e7eb; padding-top: 20px; }
    .totals div { padding: 6px 0; font-size: 14px; color: #6b7280; }
    .total { font-size: 22px; font-weight: 700; color: #006747; border-top: 2px solid #006747; padding-top: 12px; margin-top: 12px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="aku-logo">AGA KHAN UNIVERSITY</div>
      <h1>AKU SPORTS Olympiad 2026</h1>
      <p>Registration Invoice</p>
    </div>

  <div class="invoice-details">
    <div>
      <strong>Bill To:</strong>
      <p>${invoice.universityName}</p>
    </div>
    <div>
      <strong>Invoice Details:</strong>
      <p>Invoice #: ${invoice.registrationId}</p>
      <p>Date: ${invoice.date}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Sport</th>
        <th>Players</th>
        <th>Fee (PKR)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.sportName}</td>
          <td>${item.players}</td>
          <td>${item.fee.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div>Subtotal: PKR ${invoice.subtotal.toLocaleString()}</div>
    <div>Tax (5%): PKR ${invoice.tax.toLocaleString()}</div>
    <div class="total">Total: PKR ${invoice.total.toLocaleString()}</div>
  </div>

    <div class="footer">
      <p>Thank you for participating in AKU Sports Olympiad 2026!</p>
      <p>Hosted by Aga Khan University, Karachi</p>
      <p>For queries, contact: info@olympiad.pk | +92-51-1234567</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create blob and download
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoice.registrationId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
