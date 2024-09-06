/**
 * stun.ts / STUNHelpers Class
 * 
 * Ağ işlemleri ve veri dönüşümleri için çeşitli yardımcı işlevler sağlayan STUNUtils sınıfını tanımlar. Bu işlevler byte dizileri 
 * oluşturmak, bitleri okumak, byte dizilerini karşılaştırmak ve IP adreslerini dönüştürmek için kullanılır.
 * 
 * Kod diziminde karşılaşılacak bazı ifadelerin teknik açılımları:
 * 
 * 0xFF: ifadesi, hexadecimal (onaltılık) bir sayıdır. 0x ile başlayan bir sayı hexadecimal olduğunu belirtir. 
 * 0xFF hexadecimal formatta 255'e eşittir. İkilik sistemde (binary) 0xFF'in karşılığı 11111111'dir. Yani 8 bitlik bir değerdir 
 * ve tüm bitler 1'dir.
 * 
 * int >>> 8: operatörü, "unsigned right shift" (işaretsiz sağa kaydırma) operatörüdür. Bu operatör, bit seviyesinde bir kaydırma 
 * işlemi yapar ve negatif sayılar üzerinde işareti göz ardı eder. int >>> 8 ifadesi, int değerinin bitlerini 8 pozisyon sağa kaydırır.
 * Örneğin, eğer int'in ikilik sistemdeki değeri 00000000 00000000 00000011 11000000 ise (256 + 192 = 448), bu kaydırma işlemi 
 * sonucu 00000000 00000011 11000000 00000000 (192) olur. Yani, kaydırma işlemi sonucu daha yüksek anlamlı bitler (yüksek bayt) 
 * daha düşük anlamlı bitlere dönüştürülür.

 */

// "net" modülünün içeri aktarımı
import * as net from "net";

// STUNHelpers sınıfının tanımı
export class STUNHelpers {
    /* Ağ bytelarının sıralaması, düzenlenmesi (network byte order) 
    Statik bir yöntem olan _int2Buf16 bir integer parametresi alıp Buffer dizisi döner. */
    static _int2Buf16(int: number): Buffer {

        /* Buffer.alloc() metodu içerisine aldığı number değerdeki argüman ile number uzunluktaki bir Buffer oluşturur.
        Bu buffer 16 bit (2 byte) uzunluğunda bir sayıyı saklamak için kullanılır. */
        const buf = Buffer.alloc(2);

        /*buf[0] = 0xFF & (int >>> 8);: int'in yüksek 8 bitini buf[0]'a yazar. int >>> 8 ifadesi int'in yüksek 8 bitini sağa kaydırır, 
        0xFF & ... ise sadece düşük 8 bitini alır. */
        buf[0] = 0xFF & (int >>> 8);

        /* buf[1] = 0xFF & int;: int'in düşük 8 bitini buf[1]'e yazar. */
        buf[1] = 0xFF & int;

        // return buf;: Oluşturulan Buffer'ı döndürür.
        return buf;
    };

    /** _getBit() metodu bir bit değerini almak için kullanılır. Öneki olan _ ifadesi bu metodun özel veya dahili kullanım
     * için tasarlandığını belirtir. 
     * buffer, idx ve off parametreleri alır:
     *  "buffer" parametresinin türü Buffer veri türüdür. Buffer ikili verilerle çalışmayı sağlar.
     *  "idx": "buffer" içinde bit değeri alınmak istenen byte'in indeksidir. 
     *  "off": belirtilen bytedaki hangi bitin değeri alınacaksa belirtilen bit ofsetidir. Bit ofseti, byte içindeki bit konumunu belirtir (0'dan başlayarak).
     */
    static _getBit(buffer: Buffer, idx: number, off: number){
        // Little endian addressing
        
        // Maske oluşturmak 
        // Buffer.alloc(1) ifadesi başlangıçta 0'lar ile dolu olan bir Buffer nesnesi (byte dizisi) oluşturur.
        let mask = Buffer.alloc(1);

        // Bit maskesi -> binary olarak 00000001 (0x01 ifadesi maskeyi bit maskesi olarak 00000001'e ayarlar).
        mask[0] = 0x01; 
        /* Maskeyi off değeri kadar sola kaydırır. Maskenin bir biti off pozisyonuna getirmek için sola kaydırılır. Eğer "off" 3 ise
        maske değeri binary biçiminde 00001000 olacaktır.*/
        mask[0] <<= off;

        return (buffer[idx] & mask[0]) !== 0 ? 1 : 0;
    };

    /** _compareBuf(){} metodu statik bir metod olarak tanımlanır. Sınıfın özelliklerine bağlı değildir. Sınıf örneği oluşturulmadan
     * doğrudan çağrılabilir. Örnek değişkenlere erişim sağlamadan sınıf bazında çalışabilir.
     * 
     * Bu metodun temel amacı iki buffer dizisinin (nesnesinin) içerik olarak tamamen eşit olup olmadığını karşılaştırmaktır.
     * Eğer iki Buffer nesnesi de içerik olarak aynı ve aynı uzunluklara sahipse true değeri dönülür. Ancak böyle bir durum yoksa
     * false değeri döner.
     * 
     * "a" ve "b" adında iki parametre alır ve türleri ikili veri tipini temsil eden Buffer türündedir. Dönüş türü booleandir.
    */
    static _compareBuf(a: Buffer, b: Buffer): boolean {

        /** Buffer.isBuffer() ifadesi içine aldığı argümanın Buffer türünde olup olmadığını kontrol eder. Eğer buffer türünde
         * değilse false döner. Bu metodun sadece Buffer türleriyle çalışmasını sağlar.
        */
        if(!Buffer.isBuffer(a) || !Buffer.isBuffer(b)){
            return false;
        };

        /** a ve b Buffer nesnelerinin byte uzunluğu karşılaştırılır. Eğer uzunluk eşitliği yoksa false yanıtı döner. */
        if(a.length !== b.length){
            return false;
        };

        // Byte-to-byte karşılaştırması
        /** 
         * "a" ve "b" Buffer nesnelerinin her bir byte'i karşılaştırılır. "i" değişkeni döngüdeki indekstir.
         * Bu döngünün asıl amacı iki Buffer nesnesinin de her byte'inin birbirine eşit olup olmadığını kontrol etmektir.
         */
        for(let i=0; i<a.length; i+=1){
            if(a[i] !== b[i]){
                return false;
            };
        };

        // Default olarak true değeri döner
        return true;
    };
};

/**
 * 

    static _ipv4Str2Buf32(str: string): Buffer {
        return Buffer.from(str.split(".").map((n) => {
            return parseInt(n, 10);
        }));
    }

    static _ipv6Str2Buf128(str: string): Buffer {
        // Expand the double colon if it exists
        const colons = str.match(/:/g);
        const colonCount = colons ? colons.length : 0;
        str = str.replace("::", ::${":".repeat(7 - colonCount)});
        
        // Expand leading zeroes in each hextet
        const hextets = str.split(":").map(h => h.padStart(4, "0"));

        // It's an IPv4 mapped IPv6 address
        if (hextets[hextets.length - 1].split('.').length === 4 &&
            hextets[hextets.length - 2].toUpperCase() === "FFFF") {
            const buf = Buffer.alloc(16);
            buf.writeUInt32BE(0xFFFF, 8);
            STUNHelpers._ipv4Str2Buf32(hextets[hextets.length - 1]).copy(buf, 12);
            return buf;
        }

        // It's a regular IPv6 address
        return Buffer.from(hextets.join(""), "hex");
    }
 */

