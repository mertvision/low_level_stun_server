"use strict";
/**
 * type.ts: Bir konteyner yapısını temsil eden ve belli veri kapsayıcılarıyla çalışmayı sağlayan
 * bir sınıfın tanımlandığı dosyadır. Bu sınıf veri türlerini kapsüllemek ve bu verilerle işlem
 * yapmak için kullanılabilir. Özellikleri veri yapılarıyla çalışırken esneklik sağlar.
 *
 * Author: Mert Özdemir <mertozdemircontact@icloud.com>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STUNType = void 0;
// Sınıfın tanımlanması
class STUNType {
    // Sınıfın özellikleri constructor() yapıcı fonksiyonu ile belirtilir. 'type', 'bin' ve 'f' parametrelerini varsayılan değeri 'null' olarak ayarlanmıştır.
    // Bir sınıf oluşturulduğunda constructor() yapıcı fonksiyonu çağrılır ve özellikleri default null değeri ile oluşturur.
    // Tür tanımı ":" ile yapılır, ancak değer ataması "=" ile yapılır.
    constructor(type = null, bin = null, f = null) {
        this.type = type;
        this.bin = bin;
        this.f = f;
    }
    ;
}
exports.STUNType = STUNType;
;
