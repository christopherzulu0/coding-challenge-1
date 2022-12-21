import { GetServerSideProps } from 'next'
import { prisma } from '../lib/prisma'
import { useRouter } from 'next/router'
import { useState } from 'react';
import { EditIcon,DeleteIcon} from '@chakra-ui/icons'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Radio, 
  RadioGroup,
  Select, 
} from '@chakra-ui/react';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { z } from 'zod'

interface Cars{
  cars: {
    id: string
    name: string
    model: string
    wheels: string
  }[]
}

interface FormData {
  name: string
  model: string
  wheels: string
  id: string
}



export default function Home({cars}: Cars) {

  const schema = z.object({
    name: z.string().min(2),
    model: z.string().min(5),
    wheels: z.string().min(20),
  })

  const [form, setForm] = useState<FormData>({name: '', model: '',wheels: '', id: ''})

  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function create(data: FormData) {
    try {
      fetch('http://localhost:3000/api/vehicles/form', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => {
        if(data.id) {
          Delete(data.id)j
          setForm({name: '',model: '', wheels: '', id: ''})
          refreshData()
        } else {
          setForm({name: '',model: '', wheels: '', id: ''})
          refreshData()

        }
      }
        )
    } catch (error) {
      console.log(error);
    }
  }

  
  const handleSubmit = async (data: FormData) => {
    try {
     create(data) 
    } catch (error) {
      console.log(error);
    }
  }

  interface FormData {
    name: string
    model: string
    wheels: string
    id: string
  }

  async function Delete(id: string) {
    try {
     fetch(`http://localhost:3000/api/delete_api/${id}`, {
       headers: {
         "Content-Type": "application/json",
       },
       method: 'DELETE'
     }).then(() => {
       refreshData()
     })
    } catch (error) {
     console.log(error); 
    }
  }
  return (
    <>
     <Flex
      minH={'100vh'}
      align={'left'}
      justify={'left'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'left'}>
          <Heading fontSize={'4xl'}>Vehicle Management App</Heading>
          
        </Stack>
        <form 
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(form)
            }}
           >
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          >
          <Stack spacing={4}>
          
            <FormControl 
              >
              <FormLabel>Name</FormLabel>
              <Input 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              type="name" variant='filled' />
            </FormControl>
            <FormControl id="name">
              <FormLabel
              
              >Model</FormLabel>
              <Input 
               value={form.model}
               onChange={e => setForm({...form, model: e.target.value})}

              type="name"  variant='filled' />
            </FormControl>
            <RadioGroup defaultValue='1'>
            <FormControl>
          <FormLabel>Number Of Wheels</FormLabel>
          <Select 
          value={form.wheels}
          onChange={e => setForm({...form, wheels: e.target.value})}
          
          placeholder='Select number of wheels'>
            <option value="2 Wheels">2 Wheels</option>
            <option value="3 Wheels">3 Wheels</option>
            <option value="4 Wheels">4 Wheels</option>
          </Select>
        </FormControl>
        </RadioGroup>
            <Stack spacing={10}>
              
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                type="submit"
                >
                Add Vehicle
              </Button>
            </Stack>
           
          </Stack>
        </Box>
        </form>
       
      </Stack>

 
      <TableContainer marginRight='12%' marginTop='8%'>
     
  <Table size='sm' variant='striped' colorScheme='blue'>
 
    
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th>Model</Th>
        <Th>Number Of Wheels</Th>
        <Th>Edit</Th>
        <Th>Delete</Th>
      </Tr>
    </Thead>
   
    <Tbody>
    {cars.map(vehicle => (
      <Tr key={vehicle.id}>
        <Td>{vehicle.name}</Td>
        <Td>{vehicle.model}</Td>
        <Td>{vehicle.wheels}</Td>
        <Td><EditIcon color='blue.500' onClick={() => setForm({name: vehicle.name, model: vehicle.model,wheels: vehicle.wheels, id: vehicle.id})} /></Td>
        <Td><DeleteIcon color='red.500' onClick={() => Delete(vehicle.id)} /></Td>
      </Tr>
      ))}
      
    </Tbody>
    
    <Tfoot>
      <Tr>
      <Th>Name</Th>
        <Th>Model</Th>
        <Th>Number Of Wheels</Th>
        <Th>Edit</Th>
        <Th>Delete</Th>
      </Tr>
    </Tfoot>
    
  </Table>
 
</TableContainer>

    </Flex>
    
    
   
    
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  const cars = await prisma.vehicle.findMany({
    select: {
      id:true,
      name: true,
      model: true,
      wheels: true
    }
  })

  return {
    props: {
      cars
    }
  }
}