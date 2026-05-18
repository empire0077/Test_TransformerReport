    const SHEET_ID = '1qDb71n8A9v9ToTkQNDEqaUqiA3B4Go3vI52UeXUNpPY';
    const FOLDER_ID = '1Ca9K0sVJY434yQpnkWk8UPZ5KzcFgvfG';

    function doPost(e) {
      try {
        const data = JSON.parse(e.postData.contents);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheets()[0];
        
        // Handle Image Upload
        let fileUrl = "";
        if (data.image) {
          const contentType = data.image.split(';')[0].split(':')[1];
          const bytes = Utilities.base64Decode(data.image.split(',')[1]);
          const blob = Utilities.newBlob(bytes, contentType, "transformer_" + data.id + "_" + new Date().getTime() + ".jpg");
          const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
          fileUrl = file.getUrl();
        }

        // Append Row: [Timestamp, ID, Status, Latitude, Longitude, Photo URL]
        sheet.appendRow([
          new Date(),
          data.id,
          data.status,
          data.lat,
          data.lng,
          fileUrl
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "result": "success" })).setMimeType(ContentService.MimeType.JSON);
      } catch (f) {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": f.toString() })).setMimeType(ContentService.MimeType.JSON);
      }
    }
