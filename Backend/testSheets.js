
import { getStudentList } from './Models/sheetsModel.js';

(async () => {
  try {
    const rows = await getStudentList();
    console.log('✅ Connected to Google Sheets!');
    console.table(rows);
  } catch (error) {
    console.error('❌ Failed to connect to Google Sheets:', error);
  }
})();
