"use strict";
/**
 * Ağ işlemleri ve veri dönüşümleri için çeşitli yardımcı işlevler sağlayan STUNUtils sınıfını tanımlar. Bu işlevler byte dizileri
 * oluşturmak, bitleri okumak, byte dizilerini karşılaştırmak ve IP adreslerini dönüştürmek için kullanılır.,
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STUNHelpers = void 0;
// STUNHelpers sınıfının tanımı
class STUNHelpers {
    // Network byte order (big endian)
    static _int2Buf16(int) {
        const buf = Buffer.alloc(2);
        buf[0] = 0xFF & (int >>> 8);
        buf[1] = 0xFF & int;
        return buf;
    }
    // Little endian addressing
    static _getBit(buffer, idx, off) {
        let mask = Buffer.alloc(1);
        mask[0] = 0x01;
        mask[0] <<= off;
        return (buffer[idx] & mask[0]) !== 0 ? 1 : 0;
    }
    static _compareBuf(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i += 1) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    static _ipv4Str2Buf32(str) {
        return Buffer.from(str.split(".").map((n) => {
            return parseInt(n, 10);
        }));
    }
    static _ipv6Str2Buf128(str) {
        // Expand the double colon if it exists
        const colons = str.match(/:/g);
        const colonCount = colons ? colons.length : 0;
        str = str.replace("::", `::${":".repeat(7 - colonCount)}`);
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
}
exports.STUNHelpers = STUNHelpers;
