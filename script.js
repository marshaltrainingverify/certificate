<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Certificate Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 40px;
        }

        .container {
            max-width: 450px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            margin-top: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
        }

        button {
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
        }

        button:hover {
            background: #0056b3;
        }

        /* Modal */
        #resultModal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }

        .modal-content {
            background: white;
            width: 90%;
            max-width: 450px;
            margin: 80px auto;
            padding: 25px;
            border-radius: 8px;
        }

        .modal-content h2 {
            margin-top: 0;
        }

        .close-btn {
            background: #dc3545;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
        }

        .close-btn:hover {
            background: #b52a36;
        }

        .detail {
            margin-bottom: 10px;
        }

        .label {
            font-weight: bold;
        }
    </style>
</head>

<body>

<div class="container">
    <h2>Certificate Verification</h2>

    <input id="certInput" type="text" placeholder="Enter Certificate Number">
    <button onclick="verifyCert()">Verify</button>
</div>

<!-- Modal -->
<div id="resultModal">
    <div class="modal-content">
        <h2 id="modalTitle">Certificate Details</h2>

        <div class="detail"><span class="label">Certificate No:</span> <span id="certno"></span></div>
        <div class="detail"><span class="label">Company:</span> <span id="company"></span></div>
        <div class="detail"><span class="label">Course Title:</span> <span id="course"></span></div>
        <div class="detail"><span class="label">Course Date:</span> <span id="coursedate"></span></div>
        <div class="detail"><span class="label">Expiry Date:</span> <span id="expiry"></span></div>

        <button class="close-btn" onclick="closeModal()">Close</button>
    </div>
</div>

<script src="script.js"></script>

</body>
</html>
