import supabase from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { encode, decode } from 'base64-arraybuffer';


export const getUserImageSource = imagePath => {
    if(imagePath){
        return getFileUrl(imagePath);
    }else{
        return require('../assets/images/Penguin.png');
    }
}

export const getFileUrl = filePath =>{
    if(filePath){
        return {uri: `https://kptrqcnvdslwprfzcsar.supabase.co/storage/v1/object/public/uploads/${filePath}`}
    }
    return null;
}

export const uploadFile = async (folderName, fileUri)=>{
    try {
        let fileName = getFilePath(folderName);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        let imageData = decode(fileBase64); 
        let {data, error} = await supabase
        .storage
        .from('uploads')
        .upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/png'
        })
        if(error){
            console.log('file ipload eroor: ', error)
            return {success: false, msg: 'Nie udało się zaladować pliku'};
        }
        console.log('data: ',data)
        return { success: true, data: data.path };


    } catch (error) {
        console.log('file ipload eroor: ', error)
        return {success: false, msg: 'Nie udało się zaladować pliku'};
    }

}
export const getFilePath = (folderName) => {
    return `/${folderName}/${(new Date()).getTime()}.png`

}

