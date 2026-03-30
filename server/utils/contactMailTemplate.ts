function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
}

export function buildContactMailHtml(opts: {
    title: string
    body: string
    replyTo: string
}): string {
    const title = escapeHtml(opts.title)
    const body = escapeHtml(opts.body)
    const replyTo = escapeHtml(opts.replyTo)

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
img{-ms-interpolation-mode:bicubic}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}p,a,li,td,blockquote{mso-line-height-rule:exactly}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}.bodyCell{margin:0 auto;padding:0;width:100%}body{height:100%;margin:0;padding:0;width:100%;background:#ffffff}p{margin:0;padding:0}table{border-collapse:collapse}td,p,a{word-break:break-word}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0}img,a img{border:0;height:auto;outline:none;text-decoration:none}body,#bodyTable{background-color:rgb(244,244,244)}.mceText,.mcnTextContent,.mceLabel{font-family:"Poppins",sans-serif;color:rgb(0,0,0)}.mceText p,.mcnTextContent p{color:rgb(0,0,0);font-family:"Poppins",sans-serif;font-size:16px;font-weight:normal;line-height:1.5;text-align:center;margin:0}.mceText h1,.mcnTextContent h1{color:rgb(0,0,0);font-family:"Poppins",sans-serif;font-size:31px;font-weight:bold;line-height:1.5;text-align:center}
</style>
</head>
<body>
<center>
<table id="bodyTable" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color:rgb(244,244,244);">
  <tbody>
    <tr>
      <td class="bodyCell" align="center" valign="top">
        <table id="root" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tbody>
            <tr>
              <td style="background-color:transparent" valign="top" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                  <tbody>
                    <tr>
                      <td style="background-color:#fcfcfc" valign="top">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                          <tbody>
                            <tr>
                              <td valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                  <tbody>
                                    <!-- Logo -->
                                    <tr>
                                      <td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:0;padding-left:0;border:0;border-radius:0" valign="top" align="center">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;margin:0;vertical-align:top;max-width:100%;width:100%;height:auto" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="border:0;border-radius:0;margin:0" valign="top">
                                                <img alt="novafox Logo" src="https://novafox.at/img/novafox-logo.webp" width="80" height="auto" style="display:block;max-width:100%;height:auto;border-radius:0;margin:0 auto;">
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <!-- Title -->
                                    <tr>
                                      <td style="padding:10px" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="padding-left:20px;padding-right:20px;padding-top:15px;padding-bottom:15px">
                                                <div style="width:100%">
                                                  <h1 style="line-height:1.2;text-align:center;font-size:25px;font-family:Poppins,sans-serif;font-weight:normal;">Neue Kundenanfrage</h1>
                                                  <h2 style="line-height:1.2;text-align:center;margin-top:10px;font-size:20px;font-family:Poppins,sans-serif;font-weight:normal;">von ${title}</h2>
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <!-- Divider -->
                                    <tr>
                                      <td style="background-color:transparent;padding-top:15px;padding-bottom:15px;padding-right:70px;padding-left:70px;border:0;border-radius:0" valign="top">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="min-width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#ebebeb;line-height:0;font-size:0" valign="top">&nbsp;</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <!-- Message Label -->
                                    <tr>
                                      <td style="padding-top:10px;padding-bottom:5px;padding-right:10px;padding-left:10px" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="padding-left:70px;padding-right:70px;padding-top:0;padding-bottom:5px">
                                                <p><strong><span style="font-family:'Poppins',sans-serif;font-size:16px;">Nachricht:</span></strong></p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <!-- Message Content -->
                                    <tr>
                                      <td style="padding-top:0;padding-bottom:10px;padding-right:10px;padding-left:10px" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="padding-left:70px;padding-right:70px;padding-top:0;padding-bottom:10px">
                                                <p style="text-align:left;font-family:'Poppins',sans-serif;font-size:15px;">${body}</p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <!-- Divider -->
                                    <tr>
                                      <td style="background-color:transparent;padding-top:20px;padding-bottom:20px;padding-right:70px;padding-left:70px;border:0;border-radius:0" valign="top">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="min-width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#ebebeb;line-height:0;font-size:0" valign="top">&nbsp;</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <!-- Email Row -->
                                    <tr>
                                      <td style="padding-top:10px;padding-bottom:5px;padding-right:10px;padding-left:10px" valign="top">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="padding-left:70px;padding-right:70px;padding-top:0;padding-bottom:20px">
                                                <p style="text-align:justify;font-family:'Poppins',sans-serif;font-size:13px;">E-Mail:<span style="float:right;">${replyTo}</span></p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
          <!-- Footer -->
          <tbody>
            <tr>
              <td style="background-color:transparent" valign="top" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px" role="presentation">
                  <tbody>
                    <tr>
                      <td style="background-color:#fcfcfc" valign="top">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                          <tbody>
                            <tr>
                              <td valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td style="background-color:#f4f4f4;padding-top:20px;padding-bottom:20px;padding-right:8px;padding-left:8px;border:0;border-radius:0" valign="top">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                          <tbody>
                                            <tr>
                                              <td style="background-color:#f4f4f4;padding-top:0;padding-bottom:0" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="12" width="100%" role="presentation">
                                                  <tbody>
                                                    <tr>
                                                      <td valign="top" colspan="12" width="100%">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                                          <tbody>
                                                            <tr>
                                                              <td valign="top" align="center">
                                                                <table width="100%" style="border:0;background-color:transparent;border-collapse:separate">
                                                                  <tbody>
                                                                    <tr>
                                                                      <td style="padding-left:16px;padding-right:16px;padding-top:12px;padding-bottom:12px">
                                                                        <div style="display:inline-block;width:100%">
                                                                          <p style="text-align:center;font-size:11px;font-family:'Poppins',sans-serif;color:#666;">novafox. Alle Rechte vorbehalten.</p>
                                                                        </div>
                                                                      </td>
                                                                    </tr>
                                                                  </tbody>
                                                                </table>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
</center>
</body>
</html>`
}
