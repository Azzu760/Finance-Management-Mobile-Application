import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import dayjs from "dayjs";

export const generateTransactionHistoryPdf = async (sections) => {
  const companyName = "Click Karo";
  const taglines = [
    "Your Transactions, Simplified.",
    "Smart Spending, Smarter Decisions.",
    "Track, Analyze, Thrive.",
    "Empowering Your Financial Journey.",
    "Click Karo: Where Finance Meets Convenience.",
  ];

  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
  const currentDateTime = dayjs().format("YYYY-MM-DD_HH-mm");
  const fileName = `Transaction-History-Click-Karo-${currentDateTime}.pdf`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1, h2 {
          text-align: center;
          color: #007bff;
        }
        .company-info {
          text-align: center;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #007bff;
          color: white;
          text-transform: uppercase;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        td:nth-child(2) { 
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="company-info">
        <h1>${companyName}</h1>
        <p>"${randomTagline}"</p> 
      </div>
      <h1>Transaction History</h1>
      ${sections
        .map(
          (section) => `
            <h2>${section.title}</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${section.data
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.category || "-"}</td>
                        <td style="color: ${
                          item.type === "Income" ? "green" : "red"
                        }">${new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                    }).format(item.amount)}</td>
                        <td>${item.note || "-"}</td>
                        <td>${dayjs(item.date).format("YYYY-MM-DD HH:mm")}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          `
        )
        .join("")}
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
      dialogTitle: fileName,
    });
  } catch (error) {
    console.error("Error generating or sharing PDF:", error);
  }
};
