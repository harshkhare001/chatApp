const {CronJob} = require('cron');
const {Op} = require('sequelize');

const Messages = require('../models/message');
const ArchivedMessages = require('../models/archived-message');

exports.job = new CronJob(
    '0 0 * * *',
    function (){
        archiveOldMessages();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldMessages()
{
    try
    {
        const oneDaysAgo = new Date();
        oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

        const messagesToArchive = await Messages.findAll({where : {
            createdAt :
            {
                [Op.lt] : oneDaysAgo
            }
        }});

        await Promise.all(
            messagesToArchive.map(async (message)=>{
                await ArchivedMessages.create({
                    id : message.id,
                    text : message.text,
                    isImage : message.isImage,
                    sentBy : message.sentBy
                });

                await message.destroy();
            })
        )
        console.log('old Messages archived successfully')
    }
    catch(err)
    {
        console.log(err);
    }
}