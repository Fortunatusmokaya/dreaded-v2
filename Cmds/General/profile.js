module.exports = async (context) => {
        const { client, m } = context;

        let sender = null 
          let name = null ;





        if (!m.quoted) {
            sender = m.sender;
           name = m.pushName;

           try { ppUrl = await client.profilePictureUrl(sender , 'image') ; } catch { ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg"};
          const status = await client.fetchStatus(sender) ;

           mess = {
            image : { url : ppUrl },
            caption : 'Name : '+ name + '\nAbout:\n' + status.status
        }

        } else {
            sender = m.quoted.sender;
            name ="@"+m.quoted.sender.split("@")[0] ;

            try { ppUrl = await client.profilePictureUrl(sender , 'image') ; } catch { ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg"};

try {
          const status = await client.fetchStatus(sender) ;

} catch (error) {

const status = "About not accessible due to user privacy"

}

             mess = {
              image : { url : ppUrl },
              caption : 'Name : '+ name + '\nAbout:\n' + status.status,
               mentions:[m.quoted.sender]
          }

        } ;





            client.sendMessage(m.chat,mess,{quoted : m})

}