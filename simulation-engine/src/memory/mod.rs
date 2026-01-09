/// Memory module (placeholder for now)
/// Will be expanded with cache hierarchy later
pub struct Memory {
    data: Vec<u8>,
}

impl Memory {
    pub fn new(size: usize) -> Self {
        Memory {
            data: vec![0; size],
        }
    }

    pub fn read_u64(&self, addr: u64) -> u64 {
        let addr = addr as usize;
        if addr + 8 <= self.data.len() {
            u64::from_le_bytes([
                self.data[addr],
                self.data[addr + 1],
                self.data[addr + 2],
                self.data[addr + 3],
                self.data[addr + 4],
                self.data[addr + 5],
                self.data[addr + 6],
                self.data[addr + 7],
            ])
        } else {
            0
        }
    }

    pub fn write_u64(&mut self, addr: u64, value: u64) {
        let addr = addr as usize;
        if addr + 8 <= self.data.len() {
            let bytes = value.to_le_bytes();
            self.data[addr..addr + 8].copy_from_slice(&bytes);
        }
    }
}
