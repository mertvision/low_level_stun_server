/** 
 * type.ts: Bir konteyner yapısını temsil eden ve belli veri kapsayıcılarıyla çalışmayı sağlayan
 * bir sınıfın tanımlandığı dosyadır. Bu sınıf veri türlerini kapsüllemek ve bu verilerle işlem
 * yapmak için kullanılabilir. Özellikleri veri yapılarıyla çalışırken esneklik sağlar.
 * 
 * Author: Mert Özdemir <mertozdemircontact@icloud.com>
 */

// Sınıfın tanımlanması
class STUNType{
    // Yapıcı fonksiyonda tanımlanacak sınıf özelliklerinin türleri.
    // Üç özellik her türde veriye açıktır.
    type: any;
    bin: any; 
    f: any;

    // Sınıfın özellikleri constructor() yapıcı fonksiyonu ile belirtilir. 'type', 'bin' ve 'f' parametrelerini varsayılan değeri 'null' olarak ayarlanmıştır.
    // Bir sınıf oluşturulduğunda constructor() yapıcı fonksiyonu çağrılır ve özellikleri default null değeri ile oluşturur.
    // Tür tanımı ":" ile yapılır, ancak değer ataması "=" ile yapılır.
    constructor (type: any = null, bin: any = null, f: any = null){
        this.type = type;
        this.bin = bin;
        this.f = f;
    };
};

// Sınıfın başka dosyalar tarafından kullanılabilmesi için dışarı aktarma durumu
export {STUNType};